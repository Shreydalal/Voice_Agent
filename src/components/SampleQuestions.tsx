import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const questions = [
  "What should we know about your life story?",
  "What's your #1 superpower?",
  "What are the top 3 areas you'd like to grow in?",
  "What misconception do coworkers have about you?",
  "How do you push your boundaries and limits?",
];

const SampleQuestions = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-accent bg-clip-text text-transparent">
        Sample Interview Questions
      </h2>
      <div className="grid gap-4">
        {questions.map((question, index) => (
          <Card
            key={index}
            className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-glow-accent cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
              <p className="text-foreground">{question}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SampleQuestions;
