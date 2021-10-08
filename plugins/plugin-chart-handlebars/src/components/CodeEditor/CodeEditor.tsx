import React, { FC } from 'react';
import AceEditor, { IAceEditorProps } from 'react-ace';

// must go after AceEditor import
import 'ace-builds/src-min-noconflict/mode-handlebars';
import 'ace-builds/src-min-noconflict/mode-css';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';

export type CodeEditorMode = 'handlebars' | 'css';
export type CodeEditorTheme = 'light' | 'dark';

export interface CodeEditorProps extends IAceEditorProps {
  mode?: CodeEditorMode;
  theme?: CodeEditorTheme;
  name?: string;
}

export const CodeEditor: FC<CodeEditorProps> = ({
  mode,
  theme,
  name,
  width,
  height,
  value,
  ...rest
}: CodeEditorProps) => {
  const _name = name || Math.random().toString(36).substring(7);
  const _theme = theme === 'light' ? 'github' : 'monokai';
  const _mode = mode || 'handlebars';
  const _height = height || '300px';
  const _width = width || '100%';

  return (
    <div className={'code-editor'} style={{ minHeight: height, width: _width }}>
      <AceEditor
        mode={_mode}
        theme={_theme}
        name={_name}
        height={_height}
        width={_width}
        fontSize={14}
        showPrintMargin={true}
        focus={true}
        editorProps={{ $blockScrolling: true }}
        wrapEnabled={true}
        highlightActiveLine={true}
        value={value}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
          showGutter: true,
        }}
        {...rest}
      />
    </div>
  );
};
