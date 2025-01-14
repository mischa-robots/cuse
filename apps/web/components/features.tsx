'use client';

import { Box, Code, Computer, Laptop, MessageCircle, Text } from 'lucide-react';
import { Button } from './ui/button';

const Features = () => {
  return (
    <section id="features" className="w-full py-32 px-8">
      <div className="mb-6 mt-12 flex flex-col gap-6 lg:flex-row">
        <div className="flex w-full flex-col justify-between overflow-hidden rounded-2xl border bg-card px-12 pt-12 text-card-foreground shadow-sm">
          <div className="flex flex-col items-start gap-3 mb-8">
            <Code className="size-6" />
            <h4 className="text-xl font-semibold">Command line interface</h4>
            <p className="text-base font-normal text-muted-foreground">
              Use the Cuse CLI to manage the computers your AI agents use. Stay
              on top of the machines you use and the tasks you perform.
            </p>
          </div>
          <img
            src="https://shadcnblocks.com/images/block/placeholder-1.svg"
            alt="placeholder"
            className="max-h-52 w-full rounded-t-md object-cover shadow-[0_0_10px_rgb(0,0,0,0.2)]"
          />
        </div>
        <div className="w-full overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm">
          <div className="pl-12 pr-12 lg:pl-0">
            <img
              src="https://shadcnblocks.com/images/block/placeholder-2.svg"
              alt="placeholder"
              className="max-h-48 w-full rounded-br-md object-cover shadow-[0_0_10px_rgb(0,0,0,0.2)]"
            />
          </div>
          <div className="flex flex-col gap-3 p-12">
            <Text className="size-6" />
            <h4 className="text-xl font-semibold">Open source</h4>
            <p className="text-base font-normal text-muted-foreground">
              Cuse is open source and easy to use locally for everyone. Check
              out our repository on GitHub for an example of how to use Cuse.
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm md:flex-row">
        <div className="flex w-full flex-col p-12 md:gap-3">
          <Box className="size-6" />
          <h4 className="text-xl font-semibold">SDK</h4>
          <p className="text-base font-normal text-muted-foreground">
            Use the Cuse SDK to implement computer use in your own applications
            quickly. Interact with the computer via our JS request client SDK or
            any other language via the REST API.
          </p>
        </div>
        <div className="w-full pl-12 md:pt-12">
          <img
            src="https://shadcnblocks.com/images/block/placeholder-3.svg"
            alt="placeholder"
            className="max-h-96 w-full rounded-tl-md object-cover shadow-[0_0_10px_rgb(0,0,0,0.2)]"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
