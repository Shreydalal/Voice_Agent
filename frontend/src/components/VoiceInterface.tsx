import { useConversation } from "@11labs/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceInterfaceProps {
  agentId: "agent_9501k9y7yxxhfwm987wya07y3fvy";
}

const VoiceInterface = ({ agentId }: VoiceInterfaceProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string>("");

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to voice agent");
      toast({
        title: "Connected",
        description: "Voice agent is ready. Start speaking!",
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from voice agent");
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to voice agent. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  useEffect(() => {
    // Request microphone access on component mount
    const requestMicrophoneAccess = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        console.error("Microphone access denied:", error);
        toast({
          title: "Microphone Access Required",
          description: "Please allow microphone access to use voice features.",
          variant: "destructive",
        });
      }
    };

    requestMicrophoneAccess();
  }, [toast]);

  const startConversation = async () => {
    setIsLoading(true);
    
    try {
      // Get signed URL from backend
      const response = await fetch('https://voice-agent-1-1046.onrender.com/elevenlabs-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'get_signed_url', agentId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to connect to backend');
      }

      const data = await response.json();

      if (!data?.signed_url) {
        throw new Error("No signed URL received from backend");
      }
      
      setSignedUrl(data.signed_url);

      // Start the conversation with the signed URL
      const conversationId = await conversation.startSession({
        signedUrl: data.signed_url
      });
      
      console.log("Conversation started with ID:", conversationId);
      setIsLoading(false); // Ensure loading state is reset after success
      
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Unable to start conversation",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      toast({
        title: "Conversation Ended",
        description: "Thank you for the interview!",
      });
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Microphone Visual */}
      <div className="relative">
        <div
          className={`
            w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center
            transition-all duration-300
            ${isSpeaking ? 'animate-pulse-glow' : ''}
            ${isConnected ? 'shadow-glow-primary' : ''}
          `}
        >
          {isLoading ? (
            <Loader2 className="w-16 h-16 text-primary-foreground animate-spin" />
          ) : isConnected ? (
            <Mic className="w-16 h-16 text-primary-foreground" />
          ) : (
            <MicOff className="w-16 h-16 text-muted-foreground" />
          )}
        </div>
        
        {/* Pulsing rings when speaking */}
        {isSpeaking && (
          <>
            <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-accent animate-pulse-ring" />
            <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-accent animate-pulse-ring [animation-delay:0.5s]" />
          </>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center">
        <p className="text-xl font-semibold text-foreground">
          {isLoading ? "Connecting..." : 
           isConnected ? (isSpeaking ? "Listening..." : "Connected") : 
           "Ready to Start"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {isConnected ? "Speak naturally, the AI will respond" : "Click the button below to begin"}
        </p>
      </div>

      {/* Control Button */}
      {!isConnected ? (
        <Button
          onClick={startConversation}
          disabled={isLoading}
          size="lg"
          className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-glow-primary"
        >
          {isLoading ? "Connecting..." : "Start Conversation"}
        </Button>
      ) : (
        <Button
          onClick={endConversation}
          size="lg"
          variant="destructive"
          className="px-8 py-6 text-lg font-semibold rounded-full"
        >
          End Conversation
        </Button>
      )}
    </div>
  );
};

export default VoiceInterface;
