import { Text, Pressable, View, AccessibilityRole } from "react-native";
import React from "react";

interface ButtonOutlineProps {
  title: string;
  action?: () => void;
  children?: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
}

const ButtonOutline: React.FC<ButtonOutlineProps> = ({
  title,
  action,
  children,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = "button",
}) => {
  return (
    <Pressable
      className="border-2 border-neutral-400 rounded-lg justify-center items-center py-3 flex-row"
      onPress={action}
      accessible={true}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
    >
      {children && <View className="px-2">{children}</View>}
      <Text className="text-neutral-400 font-bold text-lg">{title}</Text>
    </Pressable>
  );
};

export default ButtonOutline;
