import React, { useState, useEffect } from 'react';
import { Editor, EditorState, ContentState, convertToRaw, convertFromRaw, RichUtils, Modifier, SelectionState } from 'draft-js';
import './editor.css';

function DemoEditor() {

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const styleMap = {
        'RED_TEXT': {
            color: 'red',
          },
    };

    useEffect(() => {
        const savedContent = localStorage.getItem('editorContent');
        if (savedContent) {
            const contentState = convertFromRaw(JSON.parse(savedContent));
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, []);

    const handleSave = () => {
        const contentState = editorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);
        localStorage.setItem('editorContent', JSON.stringify(rawContentState));
    };

    const handleBeforeInput = (char) => {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const currentBlock = contentState.getBlockForKey(selection.getStartKey());
        const blockText = currentBlock.getText();
        const startKey = selection.getStartKey();
        const startOffset = selection.getStartOffset();
        const styleMap = {
            'RED_TEXT': {
              color: 'red',
            },
           
          };

        if (char === ' ' && blockText.startsWith('#')) {

            const textStartOffset = startOffset - 1;
            const textEndOffset = currentBlock.getText().length;

            const textSelection = SelectionState.createEmpty(startKey).merge({
                anchorOffset: textStartOffset,
                focusOffset: textEndOffset,
            });

            const newContentState = Modifier.removeRange(contentState, textSelection, 'forward');

            const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
            setEditorState(newEditorState);

            const headingEditorState = RichUtils.toggleBlockType(newEditorState, 'header-one');
            setEditorState(headingEditorState);

            return 'handled';
        }

        if (char === ' ' && blockText.startsWith('***')) {

            const textStartOffset = startOffset - 3;
            const textEndOffset = currentBlock.getText().length;

            const textSelection = SelectionState.createEmpty(startKey).merge({
                anchorOffset: textStartOffset,
                focusOffset: textEndOffset,
            });

            console.log(currentBlock.getInlineStyleAt(textStartOffset))
            
            const contentWithoutStyles = Modifier.removeInlineStyle(
                contentState,
                textSelection,
                currentBlock.getInlineStyleAt(textStartOffset)
              );


            const newContentState = Modifier.removeRange(contentWithoutStyles, textSelection, 'forward');

            
            // console.log(currentBlock.getInlineStyleAt(textStartOffset))

            // const contentWithoutStyles = Modifier.removeInlineStyle(
            //     newContentState,
            //     textSelection,
            //     currentBlock.getInlineStyleAt(textStartOffset)
            //   );

            // console.log(contentWithoutStyles)

            const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
            setEditorState(newEditorState);

            const headingEditorState = RichUtils.toggleInlineStyle(newEditorState, 'UNDERLINE');
            setEditorState(headingEditorState);

            return 'handled';
        }

        if (char === ' ' && blockText.startsWith('**')) {

            const textStartOffset = startOffset - 2;
            const textEndOffset = currentBlock.getText().length;

            // console.log(textStartOffset, textEndOffset)

            const textSelection = SelectionState.createEmpty(startKey).merge({
                anchorOffset: textStartOffset,
                focusOffset: textEndOffset,
            });

            const newContentState = Modifier.removeRange(contentState, textSelection, 'forward');

            // const contentStateWithRedColor = Modifier.applyInlineStyle(newContentState, textSelection, 'RED_TEXT');

            const newEditorState = EditorState.push(editorState, newContentState, 'change-inline-style');
            setEditorState(newEditorState);

            const headingEditorState = RichUtils.toggleInlineStyle(newEditorState, 'RED_TEXT');
            setEditorState(headingEditorState);
            return 'handled';
        }

        if (char === ' ' && blockText.startsWith('*')) {

            const textStartOffset = startOffset - 1;
            const textEndOffset = currentBlock.getText().length;

            const textSelection = SelectionState.createEmpty(startKey).merge({
                anchorOffset: textStartOffset,
                focusOffset: textEndOffset,
            });

            const newContentState = Modifier.removeRange(contentState, textSelection, 'forward');

            const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
            setEditorState(newEditorState);

            const headingEditorState = RichUtils.toggleInlineStyle(newEditorState, 'BOLD');
            setEditorState(headingEditorState);

            return 'handled';
        }
        return 'not-handled';
    };

    const onChange = (newEditorState) => {
        setEditorState(newEditorState);
    };

    return (
        <>
            <div style={{ width: '80%', margin: 'auto' }}>
                <div className='d-flex'>
                    <h4>Demo editor by Mayur Shelar</h4>
                    <button onClick={handleSave}>
                        Save
                    </button>
                </div>
                <div style={{ border: '1px solid #03cffc', padding: '16px', minHeight: '200p', margin: '16px' }}>
                    <Editor
                        editorState={editorState}
                        onChange={onChange}
                        customStyleMap={styleMap}
                        handleBeforeInput={handleBeforeInput}
                    />
                </div>
            </div>
        </>
    )
}

export default DemoEditor;
