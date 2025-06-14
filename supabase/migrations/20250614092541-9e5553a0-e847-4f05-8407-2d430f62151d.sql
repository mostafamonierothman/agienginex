
-- Create a table for imported ChatGPT conversations
CREATE TABLE public.imported_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT, -- optionally link to a user
  project_tag TEXT, -- "vertical" or project label
  topic TEXT, -- Specific topic or thread
  conversation_title TEXT,
  message_index INT, -- Order of message in conversation
  role TEXT, -- "user", "assistant", "system"
  content TEXT, -- message text
  code_snippet TEXT, -- extracted code, if present
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  imported_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  conversation_id TEXT, -- Unique id for each conversation (from the file)
  raw_json JSONB -- optional: full raw message for reference
);

-- Add index for fast search by project/tag/topic
CREATE INDEX idx_conversations_project ON public.imported_conversations (project_tag);
CREATE INDEX idx_conversations_topic ON public.imported_conversations (topic);

-- Optionally, for display and retrieval, index by conversation_id and created_at
CREATE INDEX idx_conversations_convid ON public.imported_conversations (conversation_id, created_at);

-- (Optional) You may want to add RLS policies later, for now it's open for app-wide processing.
