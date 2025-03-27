import { View, Text, Pressable, AccessibilityRole } from "react-native";
import React from "react";

interface ButtonProps {
  title: string;
  action?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
}

const Button: React.FC<ButtonProps> = ({
  title,
  action,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = "button", // default role
}: ButtonProps) => {
  return (
    <Pressable
      className="bg-[#2ab07c] rounded-lg justify-center items-center py-3"
      onPress={action}
      accessible={true}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel ?? title} // fallback to title if no custom label
      accessibilityHint={accessibilityHint}
    >
      <Text className="text-white font-bold text-lg">{title}</Text>
    </Pressable>
  );
};

export default Button;
