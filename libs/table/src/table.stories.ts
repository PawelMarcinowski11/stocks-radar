import type { Meta, StoryObj } from "@storybook/angular";

import { StockData } from "./models";
import { Table } from "./table";

type Story = StoryObj<Table>;

const withContainerStyles = (storyFn: any) => {
  const story = storyFn();
  
  story.template = `
    <div style="padding: 20px;">
      <div style="margin-bottom: 15px; background: #7dd3fc33; padding: 16px; backdrop-filter: blur(24px); border: 1px solid #7dd3fc7f; box-shadow: 20px 20px 22px rgba(0,0,0,0.2); border-radius: 16px">
        <h2 style="font-size: 1.2rem; font-weight: 600;">Stock Table Demo</h2>
        <p style="font-size: 0.875rem;">
          Toggle dark mode using the Theme control in the Storybook toolbar
        </p>
      </div>
      <lib-table 
        [data]="data"
        [error]="error"
        [isLoading]="isLoading">
      </lib-table>
    </div>
  `;
  
  return story;
};

const mockStocks: StockData[] = [
  {
    symbol: 'AAPL',
    price: 185.25,
    change: 2.5,
    percentChange: 1.69,
    dayMin: 183.5,
    dayMax: 186.2,
    dayOpen: 183.0,
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: 'MSFT',
    price: 415.45,
    change: -1.2,
    percentChange: -0.39,
    dayMin: 414.1,
    dayMax: 417.8,
    dayOpen: 416.7,
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: 'GOOGL',
    price: 152.89,
    change: 3.45,
    percentChange: 2.71,
    dayMin: 148.5,
    dayMax: 153.0,
    dayOpen: 148.9,
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: 'AMZN',
    price: 178.25,
    change: -2.1,
    percentChange: -1.43,
    dayMin: 177.2,
    dayMax: 180.8,
    dayOpen: 180.3,
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: 'META',
    price: 502.10,
    change: 5.32,
    percentChange: 1.19,
    dayMin: 498.30,
    dayMax: 504.75,
    dayOpen: 498.50,
    lastUpdate: new Date().toISOString()
  }
];
const marketCrashStocks = mockStocks.map(stock => ({
  ...stock,
  change: stock.price * -0.05,
  percentChange: -5.0,
  price: stock.price * 0.95,
  dayMin: stock.price * 0.92,
  dayMax: stock.price * 1.01,
  dayOpen: stock.price * 1.01
}));
const marketRallyStocks = mockStocks.map(stock => ({
  ...stock,
  change: stock.price * 0.04,
  percentChange: 4.0,
  price: stock.price * 1.04,
  dayMin: stock.price * 0.98,
  dayMax: stock.price * 1.05,
  dayOpen: stock.price * 0.99
}));
const meta: Meta<Table> = {
  component: Table,
  title: 'Stocks/Table',
  tags: ['autodocs'],
  argTypes: {
    data: { control: 'object' },
    error: { control: 'text' },
    isLoading: { control: 'boolean' }
  },
  decorators: [withContainerStyles],
};

export default meta;

export const StandardMarket: Story = {
  args: {
    data: mockStocks,
    error: null,
    isLoading: false
  }
};
export const MarketCrash: Story = {
  args: {
    data: marketCrashStocks,
    error: null,
    isLoading: false
  }
};
export const MarketRally: Story = {
  args: {
    data: marketRallyStocks,
    error: null,
    isLoading: false
  }
};
export const LoadingState: Story = {
  args: {
    data: [],
    error: null,
    isLoading: true
  },
  parameters: {
    docs: {
      description: {
        story: 'This shows the table in a loading state. The loading icon automatically cycles through different icons using RxJS interval and pipe operators.'
      }
    }
  }
};
export const ErrorState: Story = {
  args: {
    data: [],
    error: 'Failed to fetch stock data. Please try again later.',
    isLoading: false
  }
};
export const EmptyData: Story = {
  args: {
    data: [],
    error: null,
    isLoading: false
  }
};
