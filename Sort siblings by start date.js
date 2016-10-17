// Sort currently selected node and its siblings by start date.
(function() {
    function TaskPaperContextScript(editor, options) {
        var selection = editor.selection.startItem, // Get the selected node (or the starting item of a selected range)...
            selection_parent = selection.parent;    // ... and the parent of the selected node.

        editor.outline.groupUndoAndChanges(
            function() {
                var sorted_siblings = editor
                        .outline
                        .evaluateItemPath('following-sibling::* union (descendant-or-self::* intersect ancestor-or-self::*) union preceding-sibling::*', selection)     // Obtain the item path across all siblings of the selected node...
                        .sort(function (a, b) {                   // ... and sort said siblings by start date.
                                var strA = a.hasAttribute('data-start') ? a.getAttribute('data-start', Date, false) : new Date (00, 0);
                                    strB = b.hasAttribute('data-start') ? b.getAttribute('data-start', Date, false) : new Date (00, 0);
                                return (strA !== strB) ? (strA < strB ? -1 : 1) : 0;
                            })

                sorted_siblings.forEach(    // Uproot the unsorted nodes from their common parent...
                    function(x) {x.removeFromParent()}
                );

                selection_parent.appendChildren(sorted_siblings); //... and graft them back in the right order.
            }
        );
    }

    tp3 = Application('TaskPaper');
    ds = tp3.documents;
    return ds.length ? ds[0].evaluate({
        script: TaskPaperContextScript.toString()
    }) : undefined;
})();