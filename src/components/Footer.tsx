import { BookOpen, Mail, Phone, MapPin, Linkedin, Github, Twitter, Instagram, Heart, ArrowRight } from 'lucide-react';

const currentYear = new Date().getFullYear();

const footerLinks = [
  {
    category: 'Product',
    links: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'Roadmap', href: '#' },
    ],
  },
  {
    category: 'Company',
    links: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
    ],
  },
  {
    category: 'Resources',
    links: [
      { name: 'Documentation', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Support', href: '#' },
    ],
  },
  {
    category: 'Legal',
    links: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Cookies', href: '#' },
      { name: 'License', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: Twitter, name: 'Twitter', url: '#', color: 'hover:text-blue-400' },
  { icon: Github, name: 'GitHub', url: '#', color: 'hover:text-slate-600 dark:hover:text-slate-300' },
  { icon: Linkedin, name: 'LinkedIn', url: '#', color: 'hover:text-blue-600 dark:hover:text-blue-400' },
  { icon: Instagram, name: 'Instagram', url: '#', color: 'hover:text-pink-500' },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 bg-gradient-to-b from-slate-50 dark:from-slate-900/50 to-slate-100 dark:to-slate-950 border-t transition-theme border-slate-200/50 dark:border-white/5">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-400/5 dark:bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-400/5 dark:bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-8">
            {/* Brand section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center glow-blue">
                  <BookOpen size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">StudySphere</h2>
              </div>
              <p className="text-slate-600 dark:text-blue-200/50 text-sm leading-relaxed mb-6 transition-colors">
                Built for smarter student life.
              </p>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      title={social.name}
                      className={`text-slate-500 dark:text-blue-300/40 transition-colors smooth-hover ${social.color}`}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Link sections */}
            {footerLinks.map((section) => (
              <div key={section.category}>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 transition-colors">
                  {section.category}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-slate-600 dark:text-blue-200/50 text-sm hover:text-slate-900 dark:hover:text-blue-300 transition-colors smooth-hover flex items-center gap-1 group"
                      >
                        {link.name}
                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1 group-hover:translate-x-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="my-12 h-px bg-gradient-to-r from-slate-200/0 via-slate-300 dark:via-white/10 to-slate-200/0 transition-colors" />

          {/* Contact section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Mail size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white transition-colors uppercase tracking-wide">Email</p>
                <a href="mailto:hello@studysphere.com" className="text-sm text-slate-600 dark:text-blue-200/50 hover:text-slate-900 dark:hover:text-blue-300 transition-colors smooth-hover mt-1">
                  hello@studysphere.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Phone size={18} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white transition-colors uppercase tracking-wide">Phone</p>
                <a href="tel:+1-555-0123" className="text-sm text-slate-600 dark:text-blue-200/50 hover:text-slate-900 dark:hover:text-blue-300 transition-colors smooth-hover mt-1">
                  +1 (555) 0123
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={18} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white transition-colors uppercase tracking-wide">Location</p>
                <p className="text-sm text-slate-600 dark:text-blue-200/50 mt-1">
                  San Francisco, CA
                </p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t transition-theme border-slate-200/50 dark:border-white/5">
            <div className="flex items-center gap-2 text-slate-600 dark:text-blue-200/50 text-sm transition-colors">
              <span>© {currentYear} StudySphere. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Built with</span>
              <Heart size={14} className="text-red-500 animate-pulse-subtle mx-1" />
              <span className="hidden sm:inline">by the StudySphere Team</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-slate-600 dark:text-blue-200/50 hover:text-slate-900 dark:hover:text-blue-300 transition-colors smooth-hover">
                Privacy
              </a>
              <a href="#" className="text-slate-600 dark:text-blue-200/50 hover:text-slate-900 dark:hover:text-blue-300 transition-colors smooth-hover">
                Terms
              </a>
              <a href="#" className="text-slate-600 dark:text-blue-200/50 hover:text-slate-900 dark:hover:text-blue-300 transition-colors smooth-hover">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
