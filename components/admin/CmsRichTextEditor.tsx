'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { useEffect, useState } from 'react'
import { cmsBodyToSafeHtml, looksLikeHtml, plainTextToHtml } from '../../lib/cms/richtext'
import { mediaFileUrl } from '../../lib/media'
import type { AdminMedia } from '../../lib/admin-api'
import MediaPicker from './MediaPicker'

type CmsRichTextEditorProps = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  /** Shorter min-height for secondary fields (wisdom, album blurb, etc.). */
  compact?: boolean
}

export default function CmsRichTextEditor({
  value,
  onChange,
  placeholder = 'Write content…',
  compact = false,
}: CmsRichTextEditorProps) {
  const initial = looksLikeHtml(value) ? value : plainTextToHtml(value)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [showSource, setShowSource] = useState(false)
  const [sourceDraft, setSourceDraft] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: { class: 'cms-inline-image' },
      }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder }),
    ],
    content: initial,
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => {
      onChange(cmsBodyToSafeHtml(current.getHTML()))
    },
    editorProps: {
      attributes: {
        class: `admin-richtext-editor${compact ? ' admin-richtext-editor--compact' : ''}`,
      },
    },
  })

  useEffect(() => {
    if (!editor || showSource) return
    const next = looksLikeHtml(value) ? value : plainTextToHtml(value)
    const current = editor.getHTML()
    if (sanitizeCompare(current) !== sanitizeCompare(next)) {
      editor.commands.setContent(next, { emitUpdate: false })
    }
  }, [editor, value, showSource])

  if (!editor) return <div className="admin-help">Loading editor…</div>

  function openSource() {
    if (!editor) return
    setSourceDraft(editor.getHTML())
    setShowSource(true)
  }

  function applySource() {
    if (!editor) return
    const safe = cmsBodyToSafeHtml(sourceDraft)
    editor.commands.setContent(safe || '<p></p>', { emitUpdate: false })
    onChange(safe)
    setShowSource(false)
  }

  function cancelSource() {
    setShowSource(false)
  }

  function insertImage(asset: AdminMedia) {
    if (!editor) return
    const src = asset.url || mediaFileUrl(asset.id)
    editor
      .chain()
      .focus()
      .setImage({ src, alt: asset.altText || asset.title || asset.originalName || '' })
      .run()
    setPickerOpen(false)
  }

  return (
    <div className="admin-richtext">
      <div className="admin-richtext-toolbar" role="toolbar" aria-label="Formatting">
        <ToolbarButton
          active={editor.isActive('bold')}
          disabled={showSource}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('italic')}
          disabled={showSource}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('underline')}
          disabled={showSource}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          Underline
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('strike')}
          disabled={showSource}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          Strike
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          disabled={showSource}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 3 })}
          disabled={showSource}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('bulletList')}
          disabled={showSource}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullets
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('orderedList')}
          disabled={showSource}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('blockquote')}
          disabled={showSource}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('link')}
          disabled={showSource}
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
        <ToolbarButton disabled={showSource} onClick={() => setPickerOpen(true)}>
          Image
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('table')}
          disabled={showSource}
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          Table
        </ToolbarButton>
        {editor.isActive('table') && !showSource ? (
          <>
            <ToolbarButton onClick={() => editor.chain().focus().addRowAfter().run()}>
              Row
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().addColumnAfter().run()}>
              Column
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().deleteRow().run()}>
              Delete row
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().deleteColumn().run()}>
              Delete column
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().deleteTable().run()}>
              Delete table
            </ToolbarButton>
          </>
        ) : null}
        <ToolbarButton
          disabled={showSource || !editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          Undo
        </ToolbarButton>
        <ToolbarButton
          disabled={showSource || !editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          Redo
        </ToolbarButton>
        <ToolbarButton
          disabled={showSource}
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          Clear
        </ToolbarButton>
        {showSource ? (
          <>
            <ToolbarButton onClick={applySource}>Apply HTML</ToolbarButton>
            <ToolbarButton onClick={cancelSource}>Cancel</ToolbarButton>
          </>
        ) : (
          <ToolbarButton active={showSource} onClick={openSource}>
            Source
          </ToolbarButton>
        )}
      </div>
      {showSource ? (
        <textarea
          className="admin-richtext-source"
          value={sourceDraft}
          onChange={(e) => setSourceDraft(e.target.value)}
          rows={compact ? 6 : 12}
          spellCheck={false}
          aria-label="HTML source"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={insertImage}
        imagesOnly
      />
    </div>
  )
}

function ToolbarButton({
  children,
  onClick,
  active = false,
  disabled = false,
}: {
  children: React.ReactNode
  onClick: () => void
  active?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      className={`admin-btn admin-btn--ghost admin-btn--sm${active ? ' admin-richtext-btn--active' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

function sanitizeCompare(html: string) {
  return html.replace(/\s+/g, ' ').trim()
}
