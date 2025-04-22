import * as LucideIcons from 'lucide-react';
import { ComponentProps } from 'react';

// i have absolutely no f***ing clue what any of this type gymnastics does.
// the name property only accepts LucideIconName so import it if you need it.

type LucideIconType = {
  [K in keyof typeof LucideIcons]: typeof LucideIcons[K] extends React.ForwardRefExoticComponent<any>
    ? typeof LucideIcons[K]
    : never;
};

export type LucideIconName = keyof {
  [K in keyof LucideIconType as LucideIconType[K] extends never ? never : K]: K;
};

interface IconProps extends ComponentProps<'svg'> {
  name: LucideIconName;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = LucideIcons[name] as React.ForwardRefExoticComponent<
    React.ComponentProps<'svg'> & React.RefAttributes<SVGSVGElement>
  >;

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <LucideIcon {...props} />;
};
