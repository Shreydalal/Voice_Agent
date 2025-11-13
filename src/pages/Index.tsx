import VoiceInterface from "@/components/VoiceInterface";
import SampleQuestions from "@/components/SampleQuestions";
import { Sparkles } from "lucide-react";

const Index = () => {
  // ElevenLabs agent ID configured
  const AGENT_ID = "agent_9501k9y7yxxhfwm987wya07y3fvy";
  
  console.log("Using Agent ID:", AGENT_ID);

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-accent" />
            <h1 className="text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              AI Voice Interview
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience a natural conversation with our AI-powered interview assistant. 
            Just speak naturally and let the AI guide you through the interview.
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-16">
          {/* Voice Interface Section */}
          <section className="flex justify-center">
            <div className="w-full max-w-xl">
              <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-12 shadow-2xl">
                <VoiceInterface agentId={AGENT_ID} />
              </div>
            </div>
          </section>

          {/* Sample Questions Section */}
          <section>
            <SampleQuestions />
          </section>

          {/* Instructions */}
          <section className="max-w-2xl mx-auto">
            <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-4 text-center">How It Works</h3>
              <ol className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-bold text-accent">1.</span>
                  <span>Click "Start Conversation" and allow microphone access</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-accent">2.</span>
                  <span>Wait for the AI to greet you and begin the interview</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-accent">3.</span>
                  <span>Speak naturally - the AI will listen and respond in real-time</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-accent">4.</span>
                  <span>Click "End Conversation" when you're finished</span>
                </li>
              </ol>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
