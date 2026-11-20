'use client';

import { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TableKit } from '@tiptap/extension-table';
import { Markdown } from '@tiptap/markdown';
import Placeholder from '@tiptap/extension-placeholder';

type MarkdownEditorProps = {
  name: string;
  initialValue?: string;
  placeholder?: string;
};

export default function MarkdownEditor({
  name,
  initialValue = '',
  placeholder = 'Escribe el contenido de la lección…',
}: MarkdownEditorProps) {
  const [markdown, setMarkdown] = useState(initialValue);
  const [mostrarError, setMostrarError] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      TableKit,
      Placeholder.configure({ placeholder }),
      Markdown,
    ],
    content: initialValue,
    contentType: 'markdown',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        'aria-label': 'Contenido de la lección',
        'aria-required': 'true',
        class: 'tiptap',
        id: name,
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      const contenido = currentEditor.getMarkdown();
      setMarkdown(contenido);
      if (contenido.trim()) setMostrarError(false);
    },
  });

  const botonClase =
    'inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-slate-600/70 bg-slate-800/70 px-3 text-sm font-semibold text-slate-200 transition-colors hover:border-blue-400/50 hover:bg-blue-400/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-600/70 bg-slate-900/60 focus-within:border-blue-400/60 focus-within:ring-2 focus-within:ring-blue-400/20">
      <div
        aria-label="Herramientas de formato"
        className="flex flex-wrap gap-2 border-b border-white/10 bg-slate-800/70 p-3"
        role="toolbar"
      >
        <button
          type="button"
          className={botonClase}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          aria-label="Negrita"
          title="Negrita"
          disabled={!editor}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={botonClase}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          aria-label="Cursiva"
          title="Cursiva"
          disabled={!editor}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={botonClase}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          aria-label="Título"
          title="Título"
          disabled={!editor}
        >
          H2
        </button>
        <button
          type="button"
          className={botonClase}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          aria-label="Subtítulo"
          title="Subtítulo"
          disabled={!editor}
        >
          H3
        </button>
        <button
          type="button"
          className={botonClase}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          aria-label="Lista con viñetas"
          title="Lista con viñetas"
          disabled={!editor}
        >
          • Lista
        </button>
        <button
          type="button"
          className={botonClase}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          aria-label="Lista numerada"
          title="Lista numerada"
          disabled={!editor}
        >
          1. Lista
        </button>
        <button
          type="button"
          className={botonClase}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          aria-label="Cita"
          title="Cita"
          disabled={!editor}
        >
          Cita
        </button>
        <button
          type="button"
          className={botonClase}
          onClick={() =>
            editor?.chain().focus().insertTable({
              rows: 3,
              cols: 3,
              withHeaderRow: true,
            }).run()
          }
          aria-label="Insertar tabla"
          title="Insertar tabla"
          disabled={!editor}
        >
          Tabla
        </button>
        <button
          type="button"
          className={botonClase}
          onClick={() => editor?.chain().focus().addRowAfter().run()}
          aria-label="Agregar fila a la tabla"
          title="Agregar fila"
          disabled={!editor}
        >
          + Fila
        </button>
        <button
          type="button"
          className={botonClase}
          onClick={() => editor?.chain().focus().addColumnAfter().run()}
          aria-label="Agregar columna a la tabla"
          title="Agregar columna"
          disabled={!editor}
        >
          + Columna
        </button>
        <button
          type="button"
          className={botonClase}
          onClick={() => editor?.chain().focus().undo().run()}
          aria-label="Deshacer"
          title="Deshacer"
          disabled={!editor}
        >
          ↶
        </button>
        <button
          type="button"
          className={botonClase}
          onClick={() => editor?.chain().focus().redo().run()}
          aria-label="Rehacer"
          title="Rehacer"
          disabled={!editor}
        >
          ↷
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="markdown-editor-content max-h-[60vh] min-h-72 overflow-y-auto"
      />
      <input
        type="text"
        required
        value={markdown.trim() ? 'contenido' : ''}
        onChange={() => undefined}
        onInvalid={(event) => {
          event.preventDefault();
          setMostrarError(true);
          editor?.commands.focus();
        }}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />
      <input type="hidden" name={name} value={markdown} />
      {mostrarError && (
        <p className="px-4 pb-3 text-sm text-rose-300" role="alert">
          Escribe el contenido de la lección antes de guardar.
        </p>
      )}
    </div>
  );
}
