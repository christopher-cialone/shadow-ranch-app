import { useState } from "react";
import { WesternCard, WesternCardContent, WesternCardHeader, WesternCardTitle } from "@/components/ui/WesternCard";
import { WesternButton } from "@/components/ui/WesternButton";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { useToast } from "@/hooks/use-toast";
import { useGameStore } from "@/hooks/use-game-store";

interface CodeTemplate {
  name: string;
  language: string;
  code: string;
  description: string;
  icon: string;
}

const codeTemplates: CodeTemplate[] = [
  {
    name: "Hello Solana",
    language: "rust",
    description: "Basic Rust program structure",
    icon: "fa-code",
    code: `fn main() {
    println!("Hello, Solana!");
    
    // Your code here
    let message = "Welcome to the blockchain!";
    println!("{}", message);
}`
  },
  {
    name: "Anchor Program",
    language: "rust",
    description: "Basic Anchor program template",
    icon: "fa-anchor",
    code: `use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod my_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from Solana!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
`
  },
  {
    name: "Seahorse Program",
    language: "python",
    description: "Python Seahorse template",
    icon: "fa-python",
    code: `# Seahorse Python Program
from seahorse.prelude import *

declare_id('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS')

@instruction
def initialize():
    print("Hello from Seahorse!")
    
    # Your Python code here
    message = "Python + Solana = Magic!"
    print(message)
`
  },
  {
    name: "Token Program",
    language: "rust",
    description: "Basic token operations",
    icon: "fa-coins",
    code: `use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod token_program {
    use super::*;

    pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
        msg!("Minting {} tokens", amount);
        
        // Token minting logic here
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintToken<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}
`
  }
];

export default function Playground() {
  const [code, setCode] = useState(codeTemplates[0].code);
  const [language, setLanguage] = useState("rust");
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([
    "$ Welcome to the Playground",
    "Ready to experiment with Solana development!",
    "Select a template or write your own code."
  ]);

  const { toast } = useToast();
  const gameStore = useGameStore();

  const handleTemplateSelect = (index: number) => {
    const template = codeTemplates[index];
    setSelectedTemplate(index);
    setCode(template.code);
    setLanguage(template.language);
  };

  const handleRun = async () => {
    setIsRunning(true);
    gameStore.triggerNetworkPing();
    
    // Simulate code execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newOutput = [
      `$ ${language === 'rust' ? 'cargo run' : 'python main.py'}`,
      language === 'rust' ? 'Compiling playground v0.1.0' : 'Running Python script...',
      '   Finished in 0.75s',
      'Program executed successfully!',
      '',
      '=== Output ===',
      language === 'rust' ? 'Hello, Solana!' : 'Hello from Seahorse!',
      'Experimental code ran without errors.'
    ];
    
    setOutput(newOutput);
    setIsRunning(false);
    
    // Reward experimentation
    gameStore.earnRanchCoin(5);
    gameStore.addExperience(10);
    gameStore.triggerSparkleAnimation();
    
    toast({
      title: "Code Executed!",
      description: "Great experimentation! +5 Ranch Coins, +10 XP",
    });
  };

  const handleSave = () => {
    const timestamp = new Date().toLocaleString();
    gameStore.setLastStoredMessage(`Code saved at ${timestamp}`);
    
    toast({
      title: "Code Saved",
      description: "Your experimental code has been saved to your ranch.",
    });
  };

  const handleClear = () => {
    setCode("");
    setOutput([
      "$ Playground cleared",
      "Ready for new experiments!"
    ]);
  };

  return (
    <div className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-western text-4xl md:text-5xl text-sunset-400 mb-6">Code Playground</h1>
          <p className="font-deputy text-lg text-gray-300 max-w-2xl mx-auto">
            Experiment freely with Solana development! Try out code snippets, test your ideas, and earn rewards for exploration.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Template Selector */}
          <div className="lg:col-span-1">
            <WesternCard className="h-fit">
              <WesternCardHeader>
                <WesternCardTitle className="text-lg">Code Templates</WesternCardTitle>
              </WesternCardHeader>
              <WesternCardContent>
                <div className="space-y-3">
                  {codeTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => handleTemplateSelect(index)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedTemplate === index
                          ? 'bg-desert-600/30 border-desert-500 text-desert-400'
                          : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <i className={`fas ${template.icon} mr-2`} />
                        <span className="font-deputy font-semibold">{template.name}</span>
                      </div>
                      <p className="text-xs font-mono text-gray-400">
                        {template.description}
                      </p>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded font-mono ${
                          template.language === 'rust' 
                            ? 'bg-rust-600/30 text-rust-400' 
                            : 'bg-sage-600/30 text-sage-400'
                        }`}>
                          {template.language === 'rust' ? 'Rust' : 'Python'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </WesternCardContent>
            </WesternCard>

            {/* Quick Actions */}
            <WesternCard className="mt-6">
              <WesternCardHeader>
                <WesternCardTitle className="text-lg">Quick Actions</WesternCardTitle>
              </WesternCardHeader>
              <WesternCardContent>
                <div className="space-y-3">
                  <WesternButton 
                    variant="primary" 
                    className="w-full"
                    onClick={handleRun}
                    disabled={isRunning}
                  >
                    {isRunning ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2" />
                        Running...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-play mr-2" />
                        Run Code
                      </>
                    )}
                  </WesternButton>
                  <WesternButton 
                    variant="secondary" 
                    className="w-full"
                    onClick={handleSave}
                  >
                    <i className="fas fa-save mr-2" />
                    Save Code
                  </WesternButton>
                  <WesternButton 
                    variant="ghost" 
                    className="w-full"
                    onClick={handleClear}
                  >
                    <i className="fas fa-trash mr-2" />
                    Clear
                  </WesternButton>
                </div>
              </WesternCardContent>
            </WesternCard>
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-2">
            <WesternCard className="h-[700px]">
              <WesternCardContent className="p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-deputy text-xl text-sunset-400">
                    Experimental Editor
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-gray-400">
                      {language === 'rust' ? 'Rust (Anchor)' : 'Python (Seahorse)'}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${
                      isRunning ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
                    }`} />
                  </div>
                </div>

                <div className="h-[calc(100%-80px)]">
                  <div className="code-editor rounded-lg overflow-hidden h-full">
                    <div className="bg-gray-800 px-4 py-2 border-b border-gray-600 flex items-center justify-between">
                      <span className="text-sm text-gray-400 font-mono">
                        playground.{language === 'rust' ? 'rs' : 'py'}
                      </span>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                      </div>
                    </div>
                    <textarea 
                      className="w-full h-[calc(100%-48px)] bg-gray-900 text-gray-300 p-4 font-mono text-sm resize-none border-none outline-none"
                      placeholder="// Start experimenting..."
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                </div>
              </WesternCardContent>
            </WesternCard>
          </div>

          {/* Output & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Console Output */}
            <WesternCard>
              <WesternCardHeader>
                <WesternCardTitle className="text-lg">Console Output</WesternCardTitle>
              </WesternCardHeader>
              <WesternCardContent>
                <div className="bg-gray-900 rounded border border-gray-700 p-4 h-64 overflow-y-auto font-mono text-sm">
                  {output.map((line, index) => (
                    <div 
                      key={index} 
                      className={
                        line.startsWith('$') ? 'text-green-400' :
                        line.includes('Compiling') || line.includes('Running') || line.includes('Finished') ? 'text-gray-400' :
                        line.includes('===') ? 'text-blue-400 font-bold' :
                        line.includes('error') ? 'text-red-400' :
                        line.includes('Hello') || line.includes('success') ? 'text-white' :
                        'text-gray-300'
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </WesternCardContent>
            </WesternCard>

            {/* Experiment Stats */}
            <WesternCard>
              <WesternCardHeader>
                <WesternCardTitle className="text-lg">Experiment Stats</WesternCardTitle>
              </WesternCardHeader>
              <WesternCardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-mono text-gray-400">Ranch Coins</span>
                    <span className="font-deputy text-sunset-400">
                      {gameStore.ranchData.coins}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-mono text-gray-400">Experience</span>
                    <span className="font-deputy text-sage-400">
                      {gameStore.ranchData.experience}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-mono text-gray-400">Code Lines</span>
                    <span className="font-deputy text-desert-400">
                      {code.split('\n').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-mono text-gray-400">Language</span>
                    <span className="font-deputy text-rust-400">
                      {language === 'rust' ? 'Rust' : 'Python'}
                    </span>
                  </div>
                </div>
              </WesternCardContent>
            </WesternCard>

            {/* Tips */}
            <WesternCard>
              <WesternCardHeader>
                <WesternCardTitle className="text-lg">Pro Tips</WesternCardTitle>
              </WesternCardHeader>
              <WesternCardContent>
                <div className="space-y-2 text-sm font-mono text-gray-300">
                  <div className="flex items-start">
                    <i className="fas fa-lightbulb text-desert-400 mr-2 mt-1" />
                    <span>Experiment with different templates to learn new patterns</span>
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-star text-sage-400 mr-2 mt-1" />
                    <span>Save interesting code snippets for later reference</span>
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-rocket text-sunset-400 mr-2 mt-1" />
                    <span>Each successful run earns you experience and coins</span>
                  </div>
                </div>
              </WesternCardContent>
            </WesternCard>
          </div>
        </div>
      </div>
    </div>
  );
}
