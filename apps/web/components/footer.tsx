import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const sections = [
  {
    title: 'Cuse',
    links: [
      { name: 'Features', href: '#features' },
      { name: 'Benefits', href: '#benefits' },
      { name: 'Roadmap', href: '#roadmap' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
    ],
  },
];

const Footer = () => {
  return (
    <section id="footer" className="py-32 px-8">
      <div className="w-full">
        <footer>
          <div className="grid grid-cols-3 justify-between gap-10 lg:grid-cols-6 lg:text-left">
            <div className="col-span-3 flex w-full flex-col justify-between gap-6 lg:col-span-2">
              <div>
                <span className="flex items-center gap-4">
                  <img src="/logo.svg" alt="logo" className="w-8 dark:invert" />
                  <p className="text-3xl font-semibold">Cuse</p>
                </span>
                <p className="mt-6 text-muted-foreground">
                  A toolkit for implementing computer use in your applications.
                </p>
              </div>
              <ul className="flex items-center space-x-6">
                <li className="font-medium duration-200 hover:scale-110 hover:text-muted-foreground">
                  <a href="https://github.com/cuse-ai/cuse" target="_blank">
                    <FaGithub className="size-6" />
                  </a>
                </li>
                <li className="font-medium duration-200 hover:scale-110 hover:text-muted-foreground">
                  <a href="https://discord.gg/cuse" target="_blank">
                    <FaDiscord className="size-6" />
                  </a>
                </li>
              </ul>
            </div>
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="col-span-2">
                <h3 className="mb-5 font-medium">{section.title}</h3>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-20 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-left">
            <p>
              <span className="mr-2 font-bold text-primary">Cuse</span>© All
              rights reserved.
            </p>
            <p>Made with ❤️ in Berlin by Cuse</p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
