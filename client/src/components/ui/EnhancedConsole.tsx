import { useState, useEffect, useRef } from 'react';
import { TechCard } from './TechCard';

interface ConsoleMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'code';
  message: string;
  timestamp: Date;
  details?: string;
}

interface EnhancedConsoleProps {
  messages: ConsoleMessage[];
  onClear?: () => void;
  maxMessages?: number;
}

export function EnhancedConsole({ messages, onClear, maxMessages = 100 }: EnhancedConsoleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredMessages = messages.filter(msg => 
    filter === 'all' || msg.type === filter
  ).slice(-maxMessages);

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✗';
      case 'code': return '⚙';
      default: return 'ℹ';
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'code': return 'text-purple-400';
      default: return 'text-cyan-400';
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500';
      case 'warning': return 'border-l-yellow-500';
      case 'error': return 'border-l-red-500';
      case 'code': return 'border-l-purple-500';
      default: return 'border-l-cyan-500';
    }
  };

  return (
    <TechCard className="bg-black/90 border-cyan-500/30">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 font-tech text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
              ▶
            </span>
            <span>SYSTEM CONSOLE</span>
          </button>
          <div className="text-sm font-code text-gray-500">
            {filteredMessages.length} messages
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm font-code text-gray-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="code">Code</option>
          </select>
          
          {onClear && (
            <button
              onClick={onClear}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-code rounded transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="max-h-64 overflow-y-auto p-4 space-y-2">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-gray-500 font-code text-sm py-4">
              No messages to display
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 border-l-4 ${getBorderColor(msg.type)} bg-gray-900/50 rounded-r`}
              >
                <div className="flex items-start space-x-2">
                  <span className={`${getMessageColor(msg.type)} text-sm font-bold`}>
                    {getMessageIcon(msg.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`font-code text-sm ${getMessageColor(msg.type)}`}>
                        {msg.message}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    {msg.details && (
                      <div className="mt-1 text-xs text-gray-400 font-mono whitespace-pre-wrap">
                        {msg.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </TechCard>
  );
}

// Hook for managing console messages
export function useConsole() {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);

  const addMessage = (type: ConsoleMessage['type'], message: string, details?: string) => {
    const newMessage: ConsoleMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date(),
      details,
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const log = (message: string, details?: string) => addMessage('info', message, details);
  const success = (message: string, details?: string) => addMessage('success', message, details);
  const warning = (message: string, details?: string) => addMessage('warning', message, details);
  const error = (message: string, details?: string) => addMessage('error', message, details);
  const code = (message: string, details?: string) => addMessage('code', message, details);

  return {
    messages,
    addMessage,
    clearMessages,
    log,
    success,
    warning,
    error,
    code,
  };
}