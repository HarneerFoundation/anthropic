<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Studio — Powered by Claude</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #080c10;
    --surface: #0d1117;
    --panel: #111820;
    --border: rgba(255,255,255,0.07);
    --border-active: rgba(99,179,237,0.4);
    --text: #e8edf2;
    --muted: rgba(232,237,242,0.45);
    --accent: #63b3ed;
    --accent2: #9f7aea;
    --green: #68d391;
    --red: #fc8181;
    --yellow: #f6e05e;
    --user-bubble: #1a2535;
    --ai-bubble: #0f1923;
    --glow: rgba(99,179,237,0.12);
  }

  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Syne', sans-serif;
    background: var(--bg);
    color: var(--text);
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* HEADER */
  header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem; height: 56px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    flex-shrink: 0; position: relative; z-index: 10;
  }
  .header-left { display: flex; align-items: center; gap: 10px; }
  .logo-mark {
    width: 30px; height: 30px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    box-shadow: 0 0 16px rgba(99,179,237,0.3);
  }
  .logo-text {
    font-size: 1rem; font-weight: 700; letter-spacing: 0.05em;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .model-badge {
    display: flex; align-items: center; gap: 6px;
    background: rgba(99,179,237,0.08);
    border: 1px solid rgba(99,179,237,0.2);
    border-radius: 20px; padding: 3px 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem; color: var(--accent); letter-spacing: 0.03em;
  }
  .model-dot {
    width: 6px; height: 6px;
    background: var(--green); border-radius: 50%;
    animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
  .btn-clear {
    background: transparent; border: 1px solid var(--border);
    color: var(--muted); padding: 5px 12px; border-radius: 6px;
    font-family: 'Syne', sans-serif; font-size: 0.75rem; cursor: pointer;
    transition: all 0.2s;
  }
  .btn-clear:hover { border-color: rgba(252,129,129,0.4); color: var(--red); background: rgba(252,129,129,0.05); }

  /* LAYOUT */
  .main { display: flex; flex: 1; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: 260px; flex-shrink: 0;
    background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; overflow: hidden;
  }
  .sidebar-section { padding: 1rem; border-bottom: 1px solid var(--border); }
  .sidebar-label {
    font-size: 0.6rem; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 0.75rem;
    font-family: 'JetBrains Mono', monospace;
  }
  .upload-zone {
    border: 1.5px dashed rgba(99,179,237,0.25); border-radius: 10px;
    padding: 1.2rem 1rem; text-align: center; cursor: pointer;
    transition: all 0.25s; background: rgba(99,179,237,0.02); position: relative;
  }
  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--accent); background: rgba(99,179,237,0.06);
    box-shadow: 0 0 20px var(--glow);
  }
  .upload-zone input[type="file"] {
    position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }
  .upload-icon { font-size: 1.6rem; margin-bottom: 6px; }
  .upload-text { font-size: 0.78rem; color: var(--muted); line-height: 1.4; }
  .upload-text strong { color: var(--accent); }
  .upload-limits { margin-top: 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; color: rgba(232,237,242,0.25); }
  .upload-btn-row {
    display: flex; gap: 8px; margin-top: 10px;
  }
  .upload-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
    background: var(--panel); border: 1px solid var(--border);
    border-radius: 8px; padding: 7px 10px;
    font-size: 0.75rem; font-weight: 600; color: var(--muted);
    cursor: pointer; transition: all 0.2s; user-select: none;
  }
  .upload-btn:hover { border-color: rgba(99,179,237,0.35); color: var(--accent); background: rgba(99,179,237,0.06); }
  .folder-btn:hover { border-color: rgba(159,122,234,0.35); color: var(--accent2); background: rgba(159,122,234,0.06); }

  .folder-group-header {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 6px; margin-top: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--accent2);
    border-left: 2px solid var(--accent2);
  }


  .file-list { flex: 1; overflow-y: auto; padding: 0.75rem; display: flex; flex-direction: column; gap: 6px; }
  .file-list::-webkit-scrollbar { width: 3px; }
  .file-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

  .file-item {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px; background: var(--panel);
    border: 1px solid var(--border); border-radius: 8px;
    transition: all 0.2s; animation: slideIn 0.3s ease;
  }
  @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
  .file-item:hover { border-color: rgba(99,179,237,0.2); }
  .file-icon {
    width: 28px; height: 28px; flex-shrink: 0; border-radius: 6px;
    display: flex; align-items: center; justify-content: center; font-size: 0.85rem;
    background: rgba(99,179,237,0.1);
  }
  .file-icon.img-type { background: rgba(104,211,145,0.1); }
  .file-icon.pdf-type { background: rgba(252,129,129,0.1); }
  .file-meta { flex: 1; min-width: 0; }
  .file-name { font-size: 0.75rem; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .file-size { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--muted); }
  .file-status { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .file-status.ready { background: var(--green); }
  .file-status.error { background: var(--red); }
  .file-status.loading { background: var(--accent); animation: pulse 1s infinite; }
  .file-remove {
    background: none; border: none; color: rgba(232,237,242,0.2);
    cursor: pointer; font-size: 0.85rem; padding: 2px 4px; border-radius: 4px;
    transition: all 0.15s; flex-shrink: 0;
  }
  .file-remove:hover { color: var(--red); background: rgba(252,129,129,0.1); }
  .file-count-bar {
    padding: 0.5rem 0.75rem; border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .file-count-text { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--muted); }
  .file-count-num { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--accent); }

  /* CHAT */
  .chat-area {
    flex: 1; display: flex; flex-direction: column;
    overflow: hidden; background: var(--bg); position: relative;
  }
  .chat-area::before {
    content: ''; position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 40px 40px; pointer-events: none;
  }
  .messages {
    flex: 1; overflow-y: auto; padding: 2rem 2rem 1rem;
    display: flex; flex-direction: column; gap: 1.5rem;
    position: relative; z-index: 1;
  }
  .messages::-webkit-scrollbar { width: 4px; }
  .messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

  .welcome {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; gap: 1rem; padding: 3rem;
    position: relative; z-index: 1;
  }
  .welcome-icon {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, rgba(99,179,237,0.15), rgba(159,122,234,0.15));
    border: 1px solid rgba(99,179,237,0.2); border-radius: 16px;
    display: flex; align-items: center; justify-content: center; font-size: 2rem;
    box-shadow: 0 0 40px rgba(99,179,237,0.1);
    animation: float 4s ease-in-out infinite;
  }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  .welcome h2 {
    font-size: 1.5rem; font-weight: 700;
    background: linear-gradient(135deg, var(--text), var(--muted));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .welcome p { font-size: 0.875rem; color: var(--muted); max-width: 420px; line-height: 1.65; font-weight: 400; }
  .welcome-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 0.5rem; }
  .chip {
    background: var(--panel); border: 1px solid var(--border); border-radius: 20px;
    padding: 6px 14px; font-size: 0.75rem; color: var(--muted); cursor: pointer; transition: all 0.2s;
  }
  .chip:hover { border-color: var(--accent); color: var(--accent); background: rgba(99,179,237,0.05); }

  .message { display: flex; gap: 12px; max-width: 820px; width: 100%; animation: msgIn 0.3s ease; }
  @keyframes msgIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .message.user { align-self: flex-end; flex-direction: row-reverse; }
  .message.ai { align-self: flex-start; }
  .msg-avatar {
    width: 32px; height: 32px; flex-shrink: 0; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 0.85rem; margin-top: 2px;
  }
  .message.user .msg-avatar { background: linear-gradient(135deg, rgba(99,179,237,0.2), rgba(159,122,234,0.2)); border: 1px solid rgba(99,179,237,0.25); }
  .message.ai .msg-avatar { background: linear-gradient(135deg, rgba(104,211,145,0.15), rgba(99,179,237,0.15)); border: 1px solid rgba(104,211,145,0.2); }
  .msg-content { flex: 1; }
  .msg-role { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; margin-bottom: 5px; }
  .message.user .msg-role { text-align: right; color: var(--accent); }
  .message.ai .msg-role { color: var(--green); }
  .msg-bubble {
    padding: 0.85rem 1.1rem; border-radius: 12px;
    font-size: 0.9rem; line-height: 1.7; font-weight: 400;
    white-space: pre-wrap; word-break: break-word;
  }
  .message.user .msg-bubble { background: var(--user-bubble); border: 1px solid rgba(99,179,237,0.15); border-top-right-radius: 4px; }
  .message.ai .msg-bubble { background: var(--ai-bubble); border: 1px solid var(--border); border-top-left-radius: 4px; }
  .msg-files { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .msg-file-chip {
    display: flex; align-items: center; gap: 5px;
    background: rgba(99,179,237,0.08); border: 1px solid rgba(99,179,237,0.15);
    border-radius: 6px; padding: 3px 8px; font-size: 0.7rem; color: var(--accent);
    font-family: 'JetBrains Mono', monospace;
  }

  .typing-indicator { display: flex; align-items: center; gap: 5px; padding: 0.75rem 1rem; }
  .typing-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: typingBounce 1.2s infinite; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-6px);opacity:1} }

  .error-msg {
    background: rgba(252,129,129,0.06); border: 1px solid rgba(252,129,129,0.25);
    border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.82rem; color: var(--red);
    display: flex; align-items: flex-start; gap: 8px; line-height: 1.5;
  }

  /* INPUT BAR */
  .input-bar {
    padding: 1rem 1.5rem 1.5rem; border-top: 1px solid var(--border);
    background: var(--surface); position: relative; z-index: 1; flex-shrink: 0;
  }
  .attached-preview { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 0.75rem; }
  .attached-chip {
    display: flex; align-items: center; gap: 6px;
    background: var(--panel); border: 1px solid rgba(99,179,237,0.2);
    border-radius: 6px; padding: 4px 10px; font-size: 0.72rem; color: var(--accent);
    font-family: 'JetBrains Mono', monospace; animation: slideIn 0.2s ease;
  }
  .attached-chip-remove {
    background: none; border: none; color: rgba(99,179,237,0.4);
    cursor: pointer; font-size: 0.75rem; transition: color 0.15s; padding: 0 2px;
  }
  .attached-chip-remove:hover { color: var(--red); }
  .input-wrapper {
    display: flex; align-items: flex-end; gap: 10px;
    background: var(--panel); border: 1.5px solid var(--border);
    border-radius: 14px; padding: 10px 10px 10px 14px; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input-wrapper:focus-within { border-color: rgba(99,179,237,0.35); box-shadow: 0 0 0 3px rgba(99,179,237,0.06); }
  .input-textarea {
    flex: 1; background: transparent; border: none; outline: none;
    color: var(--text); font-family: 'Syne', sans-serif;
    font-size: 0.9rem; font-weight: 400; line-height: 1.5;
    resize: none; min-height: 24px; max-height: 200px; overflow-y: auto;
  }
  .input-textarea::placeholder { color: rgba(232,237,242,0.25); }
  .input-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .btn-attach {
    width: 36px; height: 36px; background: transparent;
    border: 1px solid var(--border); border-radius: 8px; color: var(--muted);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 1rem; transition: all 0.2s; position: relative;
  }
  .btn-attach input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .btn-attach:hover { border-color: rgba(99,179,237,0.35); color: var(--accent); background: rgba(99,179,237,0.06); }
  .btn-send {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border: none; border-radius: 8px; color: white; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 1rem;
    transition: all 0.2s; box-shadow: 0 2px 12px rgba(99,179,237,0.25);
  }
  .btn-send:hover { transform: scale(1.05); box-shadow: 0 4px 20px rgba(99,179,237,0.4); }
  .btn-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
  .input-hint { margin-top: 6px; display: flex; justify-content: space-between; align-items: center; }
  .hint-text { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: rgba(232,237,242,0.2); }
  .char-count { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: rgba(232,237,242,0.2); }

  .payload-bar {
    padding: 0.5rem 0.75rem 0.75rem;
    border-top: 1px solid var(--border);
  }
  .payload-bar-label {
    display: flex; justify-content: space-between;
    font-family: 'JetBrains Mono', monospace; font-size: 0.62rem;
    color: var(--muted); margin-bottom: 5px;
  }
  #payloadDisplay { color: var(--accent); }
  .payload-track {
    height: 4px; background: rgba(255,255,255,0.06);
    border-radius: 2px; overflow: hidden;
  }
  .payload-fill {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, var(--green), var(--accent));
    transition: width 0.3s, background 0.3s;
  }
  .payload-fill.warn { background: linear-gradient(90deg, var(--yellow), #f6ad55); }
  .payload-fill.danger { background: linear-gradient(90deg, #f6ad55, var(--red)); }
  .payload-limit-label {
    font-family: 'JetBrains Mono', monospace; font-size: 0.58rem;
    color: rgba(232,237,242,0.2); text-align: right; margin-top: 3px;
  }

    position: fixed; bottom: 80px; right: 20px;
    background: var(--panel); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 16px; font-size: 0.8rem; color: var(--text);
    z-index: 999; transform: translateY(20px); opacity: 0;
    transition: all 0.3s; pointer-events: none; max-width: 280px;
  }
  .toast.show { transform: translateY(0); opacity: 1; }
  .toast.error { border-color: rgba(252,129,129,0.3); }
  .toast.success { border-color: rgba(104,211,145,0.3); }

  @media (max-width: 768px) {
    .sidebar { display: none; }
    .messages { padding: 1.5rem 1rem 0.5rem; }
    .input-bar { padding: 0.75rem 1rem 1rem; }
  }
</style>
</head>
<body>

<header>
  <div class="header-left">
    <div class="logo-mark">✦</div>
    <span class="logo-text">AI Studio</span>
    <div class="model-badge">
      <div class="model-dot"></div>
      gemini-1.5-flash
    </div>
  </div>
  <button class="btn-clear" onclick="clearChat()">Clear Chat</button>
</header>

<div class="main">
  <aside class="sidebar">
    <div class="sidebar-section">
      <div class="sidebar-label">Upload Files</div>
      <div class="upload-zone" id="dropZone">
        <input type="file" multiple accept="image/*,.pdf,.txt,.md,.csv,.json,.js,.py,.html,.css,.ts,.jsx,.tsx,.xml,.yaml,.yml" id="sidebarFileInput" onchange="handleFileSelect(event)">
        <div class="upload-icon">⬆</div>
        <div class="upload-text"><strong>Drop files or folders here</strong><br>or use buttons below</div>
        <div class="upload-limits">Images · PDFs · Text · Code · Up to 20 files</div>
      </div>
      <div class="upload-btn-row">
        <label class="upload-btn">
          📄 Files
          <input type="file" multiple accept="image/*,.pdf,.txt,.md,.csv,.json,.js,.py,.html,.css,.ts,.jsx,.tsx,.xml,.yaml,.yml" onchange="handleFileSelect(event)" style="display:none">
        </label>
        <label class="upload-btn folder-btn">
          📁 Folder
          <input type="file" id="folderInput" webkitdirectory multiple onchange="handleFolderSelect(event)" style="display:none">
        </label>
      </div>
    </div>
    <div class="sidebar-label" style="padding:0.75rem 1rem 0.25rem; margin-bottom:0;">Attached Files</div>
    <div class="file-list" id="fileList">
      <div id="emptyState" style="text-align:center;padding:1.5rem 0;color:rgba(232,237,242,0.2);font-size:0.75rem;font-family:'JetBrains Mono',monospace;">No files attached</div>
    </div>
    <div class="file-count-bar">
      <span class="file-count-text">Files</span>
      <span class="file-count-num" id="fileCountDisplay">0 / 20</span>
    </div>
    <div class="payload-bar">
      <div class="payload-bar-label">
        <span>Payload size</span>
        <span id="payloadDisplay">0 KB</span>
      </div>
      <div class="payload-track">
        <div class="payload-fill" id="payloadFill" style="width:0%"></div>
      </div>
      <div class="payload-limit-label">limit ~3 MB</div>
    </div>
  </aside>

  <div class="chat-area">
    <div class="messages" id="messages">
      <div class="welcome" id="welcomeScreen">
        <div class="welcome-icon">✦</div>
        <h2>What can I help you with?</h2>
        <p>Upload up to 20 files — images, PDFs, code, text — and ask anything. Powered by Claude gemini-1.5-flash.</p>
        <div class="welcome-chips">
          <div class="chip" onclick="setPrompt('Summarize all the uploaded files')">Summarize files</div>
          <div class="chip" onclick="setPrompt('What are the key insights from these documents?')">Key insights</div>
          <div class="chip" onclick="setPrompt('Compare and contrast the uploaded files')">Compare files</div>
          <div class="chip" onclick="setPrompt('Extract all important data and present it clearly')">Extract data</div>
        </div>
      </div>
    </div>

    <div class="input-bar">
      <div class="attached-preview" id="attachedPreview"></div>
      <div class="input-wrapper">
        <textarea class="input-textarea" id="messageInput" placeholder="Ask anything... attach files for context" rows="1"
          onkeydown="handleKeydown(event)" oninput="autoResize(this);updateCharCount(this)"></textarea>
        <div class="input-actions">
          <button class="btn-attach" title="Attach files">
            📎
            <input type="file" multiple accept="image/*,.pdf,.txt,.md,.csv,.json,.js,.py,.html,.css,.ts,.jsx,.tsx,.xml,.yaml,.yml" id="inlineFileInput" onchange="handleFileSelect(event)">
          </button>
          <button class="btn-attach" title="Attach folder" style="font-size:0.85rem;">
            📁
            <input type="file" webkitdirectory multiple onchange="handleFolderSelect(event)">
          </button>
          <button class="btn-send" id="sendBtn" onclick="sendMessage()" title="Send (Enter)">➤</button>
        </div>
      </div>
      <div class="input-hint">
        <span class="hint-text">Enter to send · Shift+Enter for newline · 📎 files · 📁 folder</span>
        <span class="char-count" id="charCount">0</span>
      </div>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
  let attachedFiles = [];
  let conversationHistory = [];
  let isLoading = false;
  const MAX_FILES = 20;

  function getFileIcon(name, type) {
    if (type.startsWith('image/')) return { icon: '🖼', cls: 'img-type' };
    if (type === 'application/pdf') return { icon: '📄', cls: 'pdf-type' };
    return { icon: '📃', cls: '' };
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + 'KB';
    return (bytes/(1024*1024)).toFixed(1) + 'MB';
  }

  function getMediaType(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    const map = {
      jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', gif:'image/gif', webp:'image/webp',
      pdf:'application/pdf',
      txt:'text/plain', md:'text/plain', csv:'text/plain', json:'text/plain',
      js:'text/plain', ts:'text/plain', jsx:'text/plain', tsx:'text/plain',
      py:'text/plain', html:'text/plain', css:'text/plain',
      xml:'text/plain', yaml:'text/plain', yml:'text/plain'
    };
    return map[ext] || file.type || 'text/plain';
  }

  async function readAsBase64(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result.split(',')[1]);
      r.onerror = () => rej(new Error('Read failed'));
      r.readAsDataURL(file);
    });
  }

  async function readAsText(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = () => rej(new Error('Read failed'));
      r.readAsText(file);
    });
  }

  async function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    event.target.value = '';
    const remaining = MAX_FILES - attachedFiles.length;
    if (remaining <= 0) { showToast('Max 20 files reached', 'error'); return; }
    const toProcess = files.slice(0, remaining);
    if (files.length > remaining) showToast(`Only added ${remaining} file(s) — limit reached`, 'error');

    for (const file of toProcess) {
      const id = Date.now() + Math.random();
      const mediaType = getMediaType(file);
      const isImage = mediaType.startsWith('image/');
      const isPDF = mediaType === 'application/pdf';
      const isText = !isImage && !isPDF;
      const maxSize = (isImage || isPDF) ? 4*1024*1024 : 500*1024;

      if (file.size > maxSize) {
        showToast(`"${file.name}" too large (max ${isText ? '500KB' : '4MB'})`, 'error');
        continue;
      }

      addFileToUI({ id, name: file.name, size: file.size, mediaType, status: 'loading' });

      try {
        let base64 = null, textContent = null;
        if (isImage || isPDF) {
          base64 = await readAsBase64(file);
        } else {
          textContent = await readAsText(file);
          // Truncate large text files
          if (textContent.length > 50000) {
            textContent = textContent.substring(0, 50000) + '\n\n[... truncated at 50,000 chars ...]';
          }
          base64 = btoa(unescape(encodeURIComponent(textContent)));
        }
        attachedFiles.push({ id, file, base64, textContent, mediaType, name: file.name, size: file.size });
        updateFileStatus(id, 'ready');
        updateAttachedPreview();
        updateFileCount();
      } catch(err) {
        updateFileStatus(id, 'error');
        showToast(`Failed to read "${file.name}"`, 'error');
      }
    }
  }

  function addFileToUI(f) {
    const list = document.getElementById('fileList');
    const empty = document.getElementById('emptyState');
    if (empty) empty.remove();
    const { icon, cls } = getFileIcon(f.name, f.mediaType);
    const el = document.createElement('div');
    el.className = 'file-item'; el.id = `file-${f.id}`;
    el.innerHTML = `
      <div class="file-icon ${cls}">${icon}</div>
      <div class="file-meta">
        <div class="file-name" title="${f.name}">${f.name}</div>
        <div class="file-size">${formatSize(f.size)}</div>
      </div>
      <div class="file-status ${f.status}" id="status-${f.id}"></div>
      <button class="file-remove" onclick="removeFile('${f.id}')">✕</button>
    `;
    list.appendChild(el);
  }

  function updateFileStatus(id, status) {
    const dot = document.getElementById(`status-${id}`);
    if (dot) dot.className = `file-status ${status}`;
  }

  function removeFile(id) {
    attachedFiles = attachedFiles.filter(f => f.id != id);
    const el = document.getElementById(`file-${id}`);
    if (el) el.remove();
    if (attachedFiles.length === 0) {
      document.getElementById('fileList').innerHTML = '<div id="emptyState" style="text-align:center;padding:1.5rem 0;color:rgba(232,237,242,0.2);font-size:0.75rem;font-family:\'JetBrains Mono\',monospace;">No files attached</div>';
    }
    updateAttachedPreview();
    updateFileCount();
  }

  function updateFileCount() {
    document.getElementById('fileCountDisplay').textContent = `${attachedFiles.length} / ${MAX_FILES}`;
    updatePayloadMeter();
  }

  function updatePayloadMeter() {
    const ready = attachedFiles.filter(f => f.base64);
    const bytes = ready.reduce((sum, f) => sum + (f.base64 ? f.base64.length * 0.75 : 0), 0);
    const pct = Math.min((bytes / MAX_PAYLOAD_BYTES) * 100, 100);
    const fill = document.getElementById('payloadFill');
    const label = document.getElementById('payloadDisplay');
    if (!fill || !label) return;
    fill.style.width = pct + '%';
    fill.className = 'payload-fill' + (pct >= 90 ? ' danger' : pct >= 65 ? ' warn' : '');
    label.style.color = pct >= 90 ? 'var(--red)' : pct >= 65 ? 'var(--yellow)' : 'var(--accent)';
    if (bytes < 1024) label.textContent = bytes.toFixed(0) + ' B';
    else if (bytes < 1024*1024) label.textContent = (bytes/1024).toFixed(1) + ' KB';
    else label.textContent = (bytes/1024/1024).toFixed(2) + ' MB';
  }

  function updateAttachedPreview() {
    const preview = document.getElementById('attachedPreview');
    const ready = attachedFiles.filter(f => f.base64);
    preview.innerHTML = ready.map(f => `
      <div class="attached-chip">
        ${f.name.length > 22 ? f.name.substring(0,20)+'…' : f.name}
        <button class="attached-chip-remove" onclick="removeFile('${f.id}')">✕</button>
      </div>`).join('');
  }

  // ── DRAG & DROP (supports folders via DataTransferItem API) ──
  const dropZone = document.getElementById('dropZone');
  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', e => { if (!dropZone.contains(e.relatedTarget)) dropZone.classList.remove('drag-over'); });
  dropZone.addEventListener('drop', async e => {
    e.preventDefault(); dropZone.classList.remove('drag-over');
    const items = Array.from(e.dataTransfer.items || []);
    // Use DataTransferItem API to handle folders
    if (items.length && items[0].webkitGetAsEntry) {
      const entries = items.map(i => i.webkitGetAsEntry()).filter(Boolean);
      const allFiles = await readAllEntries(entries);
      await processFiles(allFiles);
    } else {
      // Fallback: flat file list
      await processFiles(Array.from(e.dataTransfer.files));
    }
  });

  // Recursively read all FileEntry items from a list of entries (handles nested folders)
  async function readAllEntries(entries, pathPrefix = '') {
    const files = [];
    for (const entry of entries) {
      if (entry.isFile) {
        const file = await new Promise((res, rej) => entry.file(res, rej));
        // Attach relative path for display
        file._relativePath = pathPrefix ? pathPrefix + '/' + file.name : file.name;
        files.push(file);
      } else if (entry.isDirectory) {
        const dirFiles = await readDirectory(entry, pathPrefix ? pathPrefix + '/' + entry.name : entry.name);
        files.push(...dirFiles);
      }
    }
    return files;
  }

  async function readDirectory(dirEntry, pathPrefix) {
    return new Promise(resolve => {
      const reader = dirEntry.createReader();
      const allEntries = [];
      function readBatch() {
        reader.readEntries(async batch => {
          if (!batch.length) {
            const files = await readAllEntries(allEntries, pathPrefix);
            resolve(files);
          } else {
            allEntries.push(...batch);
            readBatch(); // keep reading until empty batch
          }
        }, () => resolve([]));
      }
      readBatch();
    });
  }

  // Handle folder <input webkitdirectory>
  async function handleFolderSelect(event) {
    const files = Array.from(event.target.files);
    event.target.value = '';
    // webkitRelativePath gives us "folderName/sub/file.txt"
    files.forEach(f => { if (!f._relativePath) f._relativePath = f.webkitRelativePath || f.name; });
    await processFiles(files);
  }

  // Existing file input handler now calls processFiles
  async function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    event.target.value = '';
    await processFiles(files);
  }

  // ── CORE: process an array of File objects ──
  const SUPPORTED_EXTS = new Set(['jpg','jpeg','png','gif','webp','pdf','txt','md','csv','json','js','ts','jsx','tsx','py','html','css','xml','yaml','yml']);

  async function processFiles(files) {
    const remaining = MAX_FILES - attachedFiles.length;
    if (remaining <= 0) { showToast('Max 20 files reached', 'error'); return; }

    // Filter to supported types only, skip hidden files
    const supported = files.filter(f => {
      const name = f.name;
      if (name.startsWith('.')) return false; // hidden
      const ext = name.split('.').pop().toLowerCase();
      return SUPPORTED_EXTS.has(ext);
    });

    const skipped = files.length - supported.length;
    const toProcess = supported.slice(0, remaining);
    if (supported.length > remaining) showToast(`Only added ${remaining} of ${supported.length} files — limit reached`, 'error');
    else if (skipped > 0) showToast(`Skipped ${skipped} unsupported file(s)`, 'error');

    // Group by folder for UI
    const folderGroups = {};
    toProcess.forEach(f => {
      const rel = f._relativePath || f.webkitRelativePath || f.name;
      const parts = rel.split('/');
      const folder = parts.length > 1 ? parts[0] : null;
      if (folder) {
        if (!folderGroups[folder]) folderGroups[folder] = [];
        folderGroups[folder].push(f);
      } else {
        if (!folderGroups['__root__']) folderGroups['__root__'] = [];
        folderGroups['__root__'].push(f);
      }
    });

    for (const [folder, groupFiles] of Object.entries(folderGroups)) {
      // Insert folder header
      if (folder !== '__root__') {
        insertFolderHeader(folder, groupFiles.length);
      }
      for (const file of groupFiles) {
        await processSingleFile(file);
      }
    }
  }

  function insertFolderHeader(folderName, count) {
    const list = document.getElementById('fileList');
    const empty = document.getElementById('emptyState');
    if (empty) empty.remove();
    const el = document.createElement('div');
    el.className = 'folder-group-header';
    el.innerHTML = `📁 ${folderName} <span style="opacity:0.5;font-weight:400">(${count})</span>`;
    list.appendChild(el);
  }

  async function processSingleFile(file) {
    const id = Date.now() + Math.random();
    const mediaType = getMediaType(file);
    const isImage = mediaType.startsWith('image/');
    const isPDF = mediaType === 'application/pdf';
    const isText = !isImage && !isPDF;
    const maxSize = (isImage || isPDF) ? 4*1024*1024 : 500*1024;

    if (file.size > maxSize) {
      showToast(`"${file.name}" too large (max ${isText ? '500KB' : '4MB'})`, 'error');
      return;
    }

    const displayName = (file._relativePath || file.webkitRelativePath || file.name).split('/').pop();
    addFileToUI({ id, name: displayName, size: file.size, mediaType, status: 'loading' });

    try {
      let base64 = null, textContent = null;
      if (isImage || isPDF) {
        base64 = await readAsBase64(file);
      } else {
        textContent = await readAsText(file);
        if (textContent.length > 50000) textContent = textContent.substring(0, 50000) + '\n\n[... truncated at 50,000 chars ...]';
        base64 = btoa(unescape(encodeURIComponent(textContent)));
      }
      const relPath = file._relativePath || file.webkitRelativePath || file.name;
      attachedFiles.push({ id, file, base64, textContent, mediaType, name: displayName, relativePath: relPath, size: file.size });
      updateFileStatus(id, 'ready');
      updateAttachedPreview();
      updateFileCount();
    } catch(err) {
      updateFileStatus(id, 'error');
      showToast(`Failed to read "${file.name}"`, 'error');
    }
  }


  function buildContent(text, files) {
    const content = [];
    for (const f of files) {
      if (!f.base64) continue;
      const isImage = f.mediaType.startsWith('image/');
      const isPDF = f.mediaType === 'application/pdf';
      const label = f.relativePath || f.name;
      if (isImage) {
        content.push({ type: 'image', source: { type: 'base64', media_type: f.mediaType, data: f.base64 } });
      } else if (isPDF) {
        content.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: f.base64 } });
      } else {
        const txt = f.textContent || decodeURIComponent(escape(atob(f.base64)));
        content.push({ type: 'text', text: `=== FILE: ${label} ===\n${txt}\n=== END: ${label} ===` });
      }
    }
    if (text.trim()) content.push({ type: 'text', text: text.trim() });
    return content;
  }

  // Max total base64 payload ~3MB (covers ~2.25MB actual data before API overhead)
  const MAX_PAYLOAD_BYTES = 3 * 1024 * 1024;

  function getPayloadSize(content) {
    return new Blob([JSON.stringify(content)]).size;
  }

  async function sendMessage() {
    if (isLoading) return;
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    const readyFiles = attachedFiles.filter(f => f.base64);
    if (!text && readyFiles.length === 0) return;

    // ── PAYLOAD SIZE GUARD ──
    const testContent = buildContent(text, readyFiles);
    const payloadSize = getPayloadSize(testContent);
    if (payloadSize > MAX_PAYLOAD_BYTES) {
      const sizeMB = (payloadSize / 1024 / 1024).toFixed(1);
      showPayloadWarning(sizeMB, readyFiles.length);
      return;
    }

    const welcome = document.getElementById('welcomeScreen');
    if (welcome) welcome.style.display = 'none';

    const userContent = buildContent(text, readyFiles);
    appendMessage('user', text, readyFiles);
    conversationHistory.push({ role: 'user', content: userContent });

    // Clear state
    input.value = ''; autoResize(input); updateCharCount(input);
    attachedFiles = []; updateAttachedPreview(); updateFileCount();
    document.getElementById('fileList').innerHTML = '<div id="emptyState" style="text-align:center;padding:1.5rem 0;color:rgba(232,237,242,0.2);font-size:0.75rem;font-family:\'JetBrains Mono\',monospace;">No files attached</div>';

    const typingId = showTyping();
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-1.5-flash',
          max_tokens: 4096,
          system: 'You are a helpful, highly capable AI assistant. When files are provided, analyze them carefully and give thorough, accurate responses. Be concise but complete.',
          messages: conversationHistory
        })
      });

      removeTyping(typingId);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err?.error?.message || `API error ${res.status}`;
        // Friendly messages for common errors
        if (res.status === 413 || msg.includes('too large') || msg.includes('size')) {
          throw new Error('Payload too large — remove some files or use smaller ones and try again.');
        }
        if (res.status === 429) {
          throw new Error('Rate limit reached — please wait a moment and try again.');
        }
        if (res.status === 401) {
          throw new Error('Invalid API key — check your Anthropic API key configuration.');
        }
        throw new Error(msg);
      }

      const data = await res.json();
      const aiText = data.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
      conversationHistory.push({ role: 'assistant', content: aiText });
      appendMessage('ai', aiText);
    } catch(err) {
      removeTyping(typingId);
      // Network errors
      const msg = err.message.includes('fetch') || err.message.includes('Network')
        ? 'Network error — check your internet connection and try again.'
        : err.message;
      appendError(msg);
      conversationHistory.pop();
    } finally {
      setLoading(false);
    }
  }

  function showPayloadWarning(sizeMB, fileCount) {
    const msgs = document.getElementById('messages');
    const welcome = document.getElementById('welcomeScreen');
    if (welcome) welcome.style.display = 'none';
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="error-msg" style="flex-direction:column;gap:10px;border-color:rgba(246,224,94,0.3);background:rgba(246,224,94,0.05);color:var(--yellow);">
        <div style="display:flex;align-items:center;gap:8px;font-weight:700;">
          ⚠️ Payload too large (${sizeMB}MB across ${fileCount} files)
        </div>
        <div style="font-size:0.8rem;opacity:0.85;line-height:1.6;">
          The combined files exceed the ~3MB send limit. Try one of these fixes:
          <ul style="margin-top:6px;padding-left:1.2em;display:flex;flex-direction:column;gap:4px;">
            <li>Remove some files and send in <strong>smaller batches</strong></li>
            <li>For HTML/CSS files, only attach the <strong>main files</strong> (skip minified .min.css/.min.js)</li>
            <li>For images, use smaller/compressed versions</li>
            <li>For large codebases, attach only the <strong>most relevant files</strong></li>
          </ul>
        </div>
      </div>`;
    msgs.appendChild(div);
    scrollToBottom();
  }

  function appendMessage(role, text, files=[]) {
    const msgs = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = `message ${role}`;
    const filesHtml = files.length ? `<div class="msg-files">${files.map(f=>`<div class="msg-file-chip">📎 ${f.name}</div>`).join('')}</div>` : '';
    div.innerHTML = `
      <div class="msg-avatar">${role==='user'?'👤':'✦'}</div>
      <div class="msg-content">
        <div class="msg-role">${role==='user'?'You':'Claude'}</div>
        <div class="msg-bubble">${esc(text)}${filesHtml}</div>
      </div>`;
    msgs.appendChild(div);
    scrollToBottom();
  }

  function appendError(msg) {
    const msgs = document.getElementById('messages');
    const div = document.createElement('div');
    div.innerHTML = `<div class="error-msg">⚠️ <span><strong>Error:</strong> ${esc(msg)}<br><small style="opacity:0.7">Try a shorter message or smaller files. Check your connection.</small></span></div>`;
    msgs.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    const msgs = document.getElementById('messages');
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.className = 'message ai'; div.id = id;
    div.innerHTML = `<div class="msg-avatar">✦</div><div class="msg-content"><div class="msg-role">Claude</div><div class="msg-bubble" style="padding:0.5rem 1rem"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div></div>`;
    msgs.appendChild(div); scrollToBottom();
    return id;
  }

  function removeTyping(id) { const el = document.getElementById(id); if(el) el.remove(); }

  function setLoading(s) {
    isLoading = s;
    const btn = document.getElementById('sendBtn');
    btn.disabled = s; btn.textContent = s ? '◌' : '➤';
  }

  function scrollToBottom() { const m = document.getElementById('messages'); m.scrollTop = m.scrollHeight; }

  function esc(t) {
    return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/\n/g,'<br>');
  }

  function clearChat() {
    conversationHistory = []; attachedFiles = [];
    updateAttachedPreview(); updateFileCount();
    document.getElementById('fileList').innerHTML = '<div id="emptyState" style="text-align:center;padding:1.5rem 0;color:rgba(232,237,242,0.2);font-size:0.75rem;font-family:\'JetBrains Mono\',monospace;">No files attached</div>';
    document.getElementById('messages').innerHTML = `
      <div class="welcome" id="welcomeScreen">
        <div class="welcome-icon">✦</div>
        <h2>What can I help you with?</h2>
        <p>Upload up to 20 files — images, PDFs, code, text — and ask anything. Powered by Claude gemini-1.5-flash.</p>
        <div class="welcome-chips">
          <div class="chip" onclick="setPrompt('Summarize all the uploaded files')">Summarize files</div>
          <div class="chip" onclick="setPrompt('What are the key insights from these documents?')">Key insights</div>
          <div class="chip" onclick="setPrompt('Compare and contrast the uploaded files')">Compare files</div>
          <div class="chip" onclick="setPrompt('Extract all important data and present it clearly')">Extract data</div>
        </div>
      </div>`;
  }

  function setPrompt(t) { const i = document.getElementById('messageInput'); i.value = t; autoResize(i); updateCharCount(i); i.focus(); }
  function handleKeydown(e) { if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendMessage(); } }
  function autoResize(el) { el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,200)+'px'; }
  function updateCharCount(el) { document.getElementById('charCount').textContent = el.value.length.toLocaleString(); }

  function showToast(msg, type='success') {
    const t = document.getElementById('toast');
    t.textContent = msg; t.className = `toast ${type} show`;
    setTimeout(() => t.classList.remove('show'), 3000);
  }
</script>
</body>
</html>
