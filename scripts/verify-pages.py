from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote


class ScriptSources(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sources = []
        self.modules = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() != 'script':
            return
        attrs = dict(attrs)
        if attrs.get('src'):
            self.sources.append(attrs['src'])
            if attrs.get('type') == 'module':
                self.modules.append(attrs['src'])


root = Path('dist').resolve()
for name in ['index.html', 'chem-revision-app.html']:
    path = root / name
    assert path.is_file() and path.stat().st_size > 0, f'Missing or empty {name}'
assert (root / 'assets').is_dir(), 'Missing compiled assets directory'
parser = ScriptSources()
parser.feed((root / 'index.html').read_text())
assert parser.modules, 'No compiled module script found'
for src in parser.sources:
    url = urlsplit(src)
    assert not url.scheme and not url.netloc, f'Unexpected external script: {src}'
    path = unquote(url.path)
    assert not path.startswith('/'), f'Script must be relative for Pages: {src}'
    assert '/src/' not in '/' + path and not path.endswith(('.ts', '.tsx', '.jsx')), f'Uncompiled source script: {src}'
    target = (root / path).resolve()
    assert target.is_relative_to(root), f'Script escapes deployment directory: {src}'
    assert target.is_file() and target.stat().st_size > 0, f'Missing compiled script: {src}'
assert '${dataPayload}' not in (root / 'chem-revision-app.html').read_text(), 'Standalone question bank was not embedded'
(root / '.nojekyll').touch()
print('Verified compiled script entries and embedded standalone question bank.')
