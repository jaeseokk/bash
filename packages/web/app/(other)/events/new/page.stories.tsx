import { Meta, StoryObj } from "@storybook/react";

import EventNewPage from "./page";

export default {
  title: "pages/Create New Event",
  component: EventNewPage,
} as Meta<typeof EventNewPage>;

type Story = StoryObj<typeof EventNewPage>;

export const Basic: Story = {
  render: (args) => {
    return <EventNewPage {...args} />;
  },
};
