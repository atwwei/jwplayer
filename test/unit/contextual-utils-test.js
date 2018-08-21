import { isContextual, replaceContextualMacro } from 'utils/contextual';

describe('Contextual Utils', function () {
    it('returns true when the uri contains __CONTEXTUAL__', function () {
        expect(isContextual('https://cdn.jwplayer.com/v2/playlists/PFY5xHC3?format=json&search=__CONTEXTUAL__')).to.be.true;
    });

    it('returns false when the uri does not contain __CONTEXTUAL__', function () {
        expect(isContextual('https://cdn.jwplayer.com/v2/playlists/PFY5xHC3?format=json&search=__FOO__')).to.be.false;
        expect(isContextual('https://cdn.jwplayer.com/v2/playlists/PFY5xHC3?format=json&search=CONTEXTUAL')).to.be.false;
        expect(isContextual('https://cdn.jwplayer.com/v2/playlists/PFY5xHC3?format=json&search=_CONTEXTUAL_')).to.be.false;
        expect(isContextual('https://contextual.com')).to.be.false;
    });

    it ('returns false when the uri is not a string', function () {
        expect(isContextual({})).to.be.false;
        expect(isContextual([])).to.be.false;
        expect(isContextual(null)).to.be.false;
        expect(isContextual(undefined)).to.be.false;
    });

    describe('macro replacement', function () {
        let context;
        let title;
        let ogTitle;
        beforeEach(function() {
            context = document.createElement('div');
            title = document.createElement('title');
            title.textContent = 'foo';
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            ogTitle.setAttribute('content', 'bar');
        });

        it('replaces the macro with og:title', function () {
            context.appendChild(ogTitle);
            expect(replaceContextualMacro(context, '__CONTEXTUAL__')).to.equal('bar');
        });

        it('replaces the macro with title', function () {
            context.appendChild(title);
            expect(replaceContextualMacro(context, '__CONTEXTUAL__')).to.equal('foo');
        });

        it('replaces the macro with an empty string if there is neither og:title nor title', function () {
            expect(replaceContextualMacro(context, '__CONTEXTUAL__')).to.equal('');
        });

        it('prefers og:title to title', function () {
            context.appendChild(title);
            context.appendChild(ogTitle);
            expect(replaceContextualMacro(context, '__CONTEXTUAL__')).to.equal('bar');
        });

        it('URI encodes the search terms', function () {
            ogTitle.setAttribute('content', 'listen up people');
            context.appendChild(ogTitle);
            expect(replaceContextualMacro(context, '__CONTEXTUAL__')).to.equal('listen%20up%20people');
        });

        it('only URI encodes the search terms', function () {
            ogTitle.setAttribute('content', 'this is a preroll');
            context.appendChild(ogTitle);
            expect(replaceContextualMacro(context, 'http://foo.com/feed.json?search=__CONTEXTUAL__'))
                .to.equal('http://foo.com/feed.json?search=this%20is%20a%20preroll');
        });
    });
});
