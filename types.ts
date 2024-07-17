export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface Tool {
    name: string;
    description: string;
    input_schema: {
        type: string;
        properties: {
            [key: string]: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
}

export interface ToolResult {
    type: 'tool_result';
    tool_use_id: string;
    content: string;
}
