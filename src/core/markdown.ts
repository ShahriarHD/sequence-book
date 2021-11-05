import MarkdownIt from 'markdown-it';
import markItDownFootNote from 'markdown-it-footnote';

const markdown = new MarkdownIt().use(markItDownFootNote);

// customize links with target="_blank"
const defaultRender = markdown.renderer.rules.link_open || function (tokens, idx, options, _, self) {
    return self.renderToken(tokens, idx, options);
};

markdown.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // If you are sure other plugins can't add `target` - drop check below
    const aIndex = tokens[idx].attrIndex('target');

    if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']); // add new attribute
    } else {
        tokens[idx].attrs[aIndex][1] = '_blank'; // replace value of existing attr
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
};


export function renderMarkdown(markdownString: string) {
    return markdown.render(markdownString);
}
