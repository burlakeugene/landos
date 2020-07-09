import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    const html = props.value || '';
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.state.editorState = editorState;
    }
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
  }

  onEditorStateChange(editorState) {
    this.setState(
      {
        editorState,
      },
      () => {
        this.props.onChange &&
          this.props.onChange(
            draftToHtml(
              convertToRaw(this.state.editorState.getCurrentContent())
            )
          );
      }
    );
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          toolbar={{
            options: [
              'inline',
              'list',
              'textAlign',
              'colorPicker',
              'link',
              'remove',
              'history',
            ],
          }}
          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}

export default MyEditor;
