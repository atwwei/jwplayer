import { isString } from 'utils/underscore';
export const CONTEXTUAL_MACRO = '__CONTEXTUAL__';

export function isContextual(uri) {
    if (!isString(uri)) {
        return false;
    }
    return uri.indexOf(CONTEXTUAL_MACRO) > -1;
}


export function replaceContextualMacro(context, uri) {
    const ogTitle = getOgTitle(context);
    const title = (context.querySelector('title') || {}).textContent;
    const replacement = encodeURIComponent(ogTitle || title || '');

    return uri.replace(CONTEXTUAL_MACRO, replacement);
}

function getOgTitle(context) {
    let ogTitle;
    const ogTitleElement = context.querySelector('meta[property="og:title"]');
    if (ogTitleElement) {
        ogTitle = ogTitleElement.getAttribute('content');
    }

    return ogTitle;
}
