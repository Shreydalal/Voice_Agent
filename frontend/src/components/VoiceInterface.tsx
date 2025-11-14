import { useConversation } from "@11labs/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceInterfaceProps {
  agentId: "agent_2701ka0s38wxfkt953xn3ja2yr3e";
}

const VoiceInterface = ({ agentId }: VoiceInterfaceProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const connectingRef = useRef(false); // 🔥 Prevent double connections

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to voice agent");
      toast({
        title: "Connected",
        description: "Voice agent is ready. Start speaking!",
      });
      connectingRef.current = false;
      setIsLoading(false);
    },

    onDisconnect: () => {
      console.log("Disconnected from voice agent");
      connectingRef.current = false;
      setIsLoading(false);
    },

    onError: (error) => {
      console.error("Conversation error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to voice agent. Please try again.",
        variant: "destructive",
      });
      connectingRef.current = false;
      setIsLoading(false);
    },
  });

  useEffect(() => {
    const requestMic = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        toast({
          title: "Microphone Required",
          description: "Please allow microphone access.",
          variant: "destructive",
        });
      }
    };

    requestMic();

    return () => {
      // 🔥 Cleanup ensures no ghost WebSockets remain
      try {
        conversation.endSession();
      } catch {}
    };
  }, []);

  const startConversation = async () => {
    if (conversation.status === "connected" || conversation.status === "connecting") {
      console.warn("Duplicate start prevented");
      return;
    }

    if (connectingRef.current) return;
    connectingRef.current = true;

    setIsLoading(true);

    try {
      // 🔥 DO NOT STORE signedUrl — use immediately
      const response = await fetch(
        "https://voice-agent-1-1046.onrender.com/elevenlabs-conversation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_signed_url", agentId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get signed URL");
      }

      const data = await response.json();
      const signedUrl = data?.signed_url;

      if (!signedUrl) {
        throw new Error("Backend returned no signed URL");
      }

      // 🔥 Use signedUrl immediately
      await conversation.startSession({ signedUrl });

    } catch (err) {
      console.error("Failed to start conversation:", err);
      toast({
        title: "Connection Failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });

      connectingRef.current = false;
      setIsLoading(false);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      toast({
        title: "Conversation Ended",
        description: "Thank you!",
      });
    } catch (err) {
      console.error("Failed to end session:", err);
    } finally {
      connectingRef.current = false;
    }
  };

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div
          className={`
            w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center
            transition-all duration-300
            ${isSpeaking ? "animate-pulse-glow" : ""}
            ${isConnected ? "shadow-glow-primary" : ""}
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

        {isSpeaking && (
          <>
            <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-accent animate-pulse-ring" />
            <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-accent animate-pulse-ring [animation-delay:0.5s]" />
          </>
        )}
      </div>

      <div className="text-center">
        <p className="text-xl font-semibold text-foreground">
          {isLoading
            ? "Connecting..."
            : isConnected
            ? isSpeaking
              ? "Listening..."
              : "Connected"
            : "Ready to Start"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {isConnected ? "Speak naturally" : "Click to begin"}
        </p>
      </div>

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
