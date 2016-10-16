// Sort currently selected node and its siblings alphabetically.
// Script by YR.
(function() {
    function TaskPaperContextScript(editor, options) {
        var selection = editor.selection.startItem, // The selected node (or the starting item of a selected range).
                        selection_parent = selection.parent;    // The parent of the selected node.

                editor.outline.groupUndoAndChanges(
                        function() {
                                var sorted_siblings = editor
                                                .outline
                                                .evaluateItemPath('following-sibling::* union (descendant-or-self::* intersect ancestor-or-self::*) union preceding-sibling::*', selection) // Obtain the item path across all siblings of the selected node...
                                                .sort(function (a, b) { // ... and sort them. (Sort callback reused from a script by @complex_point.)
                                                                var strA = a.bodyString.toLowerCase(),
                                                                strB = b.bodyString.toLowerCase();
                                                            return (strA !== strB) ? (strA < strB ? -1 : 1) : 0;
                                                        })

                                sorted_siblings.forEach(        // Uproot the unsorted nodes from their common parent...
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