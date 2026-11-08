"use client";

import { cn } from "cn";
import {
  ArrowUpRightIcon,
  BotIcon,
  MessageCircleIcon,
  SendIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useSendChatMessage } from "@/hooks";
import type { IChatDoctor } from "@/types";
import { formatFee, getInitials } from "@/utils";
import { chatResponseSchema, sendChatMessageSchema } from "@/validation";

interface IChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  doctors?: IChatDoctor[];
}

const INITIAL_MESSAGES: IChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi! I'm the PH Healthcare assistant. Tell me what kind of doctor you need and I'll help you find one.",
  },
];

const SUGGESTED_QUERIES = [
  "I need a cardiology doctor.",
  "Which doctors are available today?",
  "Find a neurologist.",
  "What is the consultation fee?",
];

function createMessageId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function renderInlineMarkdown(text: string) {
  let offset = 0;

  return text.split(/(\*\*[^*]+\*\*)/g).map((part) => {
    const key = `${offset}-${part}`;
    offset += part.length;

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }

    return <span key={key}>{part}</span>;
  });
}

function ChatAnswer({ content }: { content: string }) {
  const lines = content.split("\n");
  let offset = 0;

  return (
    <div className="space-y-1">
      {lines.map((line) => {
        const key = `${offset}-${line}`;
        offset += line.length + 1;
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={key} className="h-1" />;
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={key} className="flex gap-2">
              <span aria-hidden="true">&bull;</span>
              <span>{renderInlineMarkdown(trimmed.slice(2))}</span>
            </div>
          );
        }

        return <p key={key}>{renderInlineMarkdown(trimmed)}</p>;
      })}
    </div>
  );
}

function ChatDoctors({
  doctors,
  onNavigate,
}: {
  doctors: IChatDoctor[];
  onNavigate: () => void;
}) {
  return (
    <div className="mt-3 space-y-2 border-t pt-3">
      {doctors.map((doctor) => (
        <Link
          key={doctor.id}
          href={`/doctors/${doctor.id}`}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg border bg-background p-2 transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {getInitials(doctor.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{doctor.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {doctor.specialization}
            </p>
          </div>
          <span className="shrink-0 text-xs font-medium text-primary">
            {formatFee(doctor.consultationFee)}
          </span>
        </Link>
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <output
      aria-label="Assistant is thinking"
      className="mr-auto flex items-center gap-2 rounded-2xl rounded-tl-sm border bg-background px-3 py-2.5 shadow-sm"
    >
      <SparklesIcon className="size-3.5 animate-pulse text-primary" />
      <span className="flex items-center text-sm font-medium text-muted-foreground">
        Thinking
        <span className="ml-1 flex items-center gap-0.5">
          <span className="size-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
          <span className="size-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
          <span className="size-1 animate-bounce rounded-full bg-muted-foreground" />
        </span>
      </span>
    </output>
  );
}

export default function ChatWidget() {
  const pathname = usePathname();
  const { mutate: sendMessage, isPending } = useSendChatMessage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>();
  const [messages, setMessages] = useState<IChatMessage[]>(INITIAL_MESSAGES);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isVisible = pathname === "/" || pathname.startsWith("/doctors");
  const showSuggestions = messages.length === 1 && !isPending;

  useEffect(() => {
    if (!open || (messages.length === 0 && !isPending)) {
      return;
    }

    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isPending, open]);

  const handleSend = (message = input) => {
    if (isPending) {
      return;
    }

    const validation = sendChatMessageSchema.safeParse({
      message,
      sessionId,
    });

    if (!validation.success) {
      toast.add({
        title: "Invalid message",
        description:
          validation.error.issues[0]?.message ?? "Please enter a message.",
        type: "error",
      });
      return;
    }

    const payload = validation.data;

    setInput("");
    setMessages((current) => [
      ...current,
      { id: createMessageId(), role: "user", content: payload.message },
    ]);

    sendMessage(payload, {
      onSuccess: (response) => {
        if (!response.success || !response.data) {
          toast.add({
            title: "Chat unavailable",
            description:
              response.message || "Unable to get a reply. Please try again.",
            type: "error",
          });
          return;
        }

        const responseValidation = chatResponseSchema.safeParse(response.data);

        if (!responseValidation.success) {
          toast.add({
            title: "Chat unavailable",
            description:
              responseValidation.error.issues[0]?.message ??
              "The chat response was invalid.",
            type: "error",
          });
          return;
        }

        setSessionId(responseValidation.data.sessionId);
        setMessages((current) => [
          ...current,
          {
            id: createMessageId(),
            role: "assistant",
            content: responseValidation.data.answer,
            doctors: responseValidation.data.doctors,
          },
        ]);
      },
      onError: (error) => {
        toast.add({
          title: "Chat unavailable",
          description:
            error.message || "Unable to get a reply. Please try again.",
          type: "error",
        });
      },
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSend();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <Button
        size="icon-lg"
        className="fixed right-4 bottom-4 z-50 size-14 rounded-full shadow-xl sm:right-6 sm:bottom-6"
        aria-label={open ? "Close chat" : "Chat with PH Healthcare Assistant"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? (
          <XIcon className="size-6" />
        ) : (
          <MessageCircleIcon className="size-6" />
        )}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="PH Healthcare Assistant"
          className="fixed right-4 bottom-20 left-4 z-50 flex h-[min(560px,calc(100dvh-7rem))] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 zoom-in-95 duration-200 sm:right-6 sm:bottom-24 sm:left-auto sm:w-[390px]"
        >
          <div className="flex items-center gap-3 border-b bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
              <BotIcon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">PH Healthcare Assistant</p>
              <p className="flex items-center gap-1.5 text-xs text-primary-foreground/80">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Online
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <XIcon />
            </Button>
          </div>

          <div
            ref={scrollRef}
            aria-live="polite"
            className="flex-1 space-y-4 overflow-y-auto bg-muted/30 p-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[90%] px-3 py-2",
                  message.role === "user"
                    ? "ml-auto rounded-2xl rounded-tr-sm bg-primary text-primary-foreground"
                    : "mr-auto rounded-2xl rounded-tl-sm border bg-background shadow-sm",
                )}
              >
                {message.role === "assistant" ? (
                  <ChatAnswer content={message.content} />
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}

                {message.doctors && message.doctors.length > 0 && (
                  <ChatDoctors
                    doctors={message.doctors}
                    onNavigate={() => setOpen(false)}
                  />
                )}
              </div>
            ))}

            {showSuggestions && (
              <div className="space-y-2">
                <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <SparklesIcon className="size-3.5" />
                  Try asking
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTED_QUERIES.map((query) => (
                    <button
                      key={query}
                      type="button"
                      onClick={() => handleSend(query)}
                      className="group flex items-center justify-between gap-2 rounded-lg border bg-background px-3 py-2 text-left text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      <span>{query}</span>
                      <ArrowUpRightIcon className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isPending && <TypingIndicator />}
          </div>

          <div className="border-t bg-background p-3">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="I need a cardiology doctor..."
                maxLength={1000}
                rows={1}
                className="max-h-32 min-h-10 resize-none overflow-y-auto rounded-xl bg-muted/40"
                aria-label="Message"
              />
              <Button
                type="submit"
                size="icon-lg"
                disabled={isPending || !input.trim()}
                aria-label="Send message"
              >
                <SendIcon />
              </Button>
            </form>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Enter to send &middot; Shift + Enter for a new line
            </p>
          </div>
        </div>
      )}
    </>
  );
}
