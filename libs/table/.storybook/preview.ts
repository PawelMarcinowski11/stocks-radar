import type { Preview } from "@storybook/angular";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' }
        ],
        showName: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const { theme } = context.globals;
        document.documentElement.style.backgroundSize = 'cover';
        document.documentElement.style.backgroundPosition = 'center';
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.backgroundImage = "url('/assets/jason-mavrommatis-GPPAjJicemU-unsplash.jpg')";
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.backgroundImage = "url('/assets/frank-mckenna-OD9EOzfSOh0-unsplash.jpg')";
      }

      return Story();
    },
  ],
};

export default preview;
