'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import { cmsBodyToSafeHtml, looksLikeHtml, plainTextToHtml } from '../../lib/cms/richtext'

type CmsRichTextEditorProps = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function CmsRichTextEditor({
  value,
  onChange,
  placeholder = 'Write content…',
}: CmsRichTextEditorProps) {
  const initial = looksLikeHtml(value) ? value : plainTextToHtml(value)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: initial,
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => {
      onChange(cmsBodyToSafeHtml(current.getHTML()))
    },
    editorProps: {
      attributes: {
        class: 'admin-richtext-editor',
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    const next = looksLikeHtml(value) ? value : plainTextToHtml(value)
    const current = editor.getHTML()
    if (sanitizeCompare(current) !== sanitizeCompare(next)) {
      editor.commands.setContent(next, { emitUpdate: false })
    }
  }, [editor, value])

  if (!editor) return <div className="admin-help">Loading editor…</div>

  return (
    <div className="admin-richtext">
      <div className="admin-richtext-toolbar" role="toolbar" aria-label="Formatting">
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullets
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('link')}
          onClick={() => {
            const previous = editor.getAttributes('link').href as string | undefined
            const url = window.prompt('Link URL', previous || 'https://')
            if (url === null) return
            if (!url.trim()) {
              editor.chain().focus().extendMarkRange('link').unsetLink().run()
              return
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
          }}
        >
          Link
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          Clear
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

function ToolbarButton({
  children,
  onClick,
  active = false,
}: {
  children: React.ReactNode
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      className={`admin-btn admin-btn--ghost admin-btn--sm${active ? ' admin-richtext-btn--active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function sanitizeCompare(html: string) {
  return html.replace(/\s+/g, ' ').trim()
}
