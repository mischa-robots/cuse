'use client';

import {
  ArrowRight,
  Blocks,
  Copy,
  MessagesSquare,
  MoveRight,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="py-32 px-8">
      <div className="w-full">
        <div className="text-center">
          <a
            href="#"
            className="mx-auto mb-3 inline-flex items-center gap-3 border px-2 py-1 text-sm"
          >
            <Badge>NEW</Badge>
            Get started in 30 seconds
            <span className="flex size-7 items-center justify-center bg-muted">
              <ArrowRight className="w-4" />
            </span>
          </a>
          <h1 className="mx-auto mb-3 mt-4 max-w-3xl text-balance text-4xl font-semibold lg:mb-7 lg:text-7xl">
            Unlock the power of computer use
          </h1>
          <p className="m mx-auto max-w-3xl text-muted-foreground lg:text-xl">
            Cuse is the all in one toolkit for implementing computer use for
            your AI agents. Seamlessly empower AI agents to interact with
            computers just like humans do.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() =>
                navigator.clipboard.writeText('npx @cuse/cli init')
              }
            >
              npx @cuse/cli init
              <Copy className="ml-2" strokeWidth={1} />
            </Button>
            <Button size="lg" variant="outline">
              See the example
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
