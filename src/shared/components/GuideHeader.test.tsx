import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { GuideHeader } from './GuideHeader';

const render = (element: React.ReactElement): string =>
  renderToStaticMarkup(<MemoryRouter>{element}</MemoryRouter>);

describe('GuideHeader', () => {
  it('links back to where the page came from', () => {
    const markup = render(<GuideHeader backTo="/visualizer" label="GUIDE" />);

    expect(markup).toContain('href="/visualizer"');
  });

  it('shows the brand next to the label of the page', () => {
    const markup = render(<GuideHeader backTo="/" label="NOT FOUND" />);

    expect(markup).toContain('INFRA');
    expect(markup).toContain('NOT FOUND');
  });

  it('carries the theme toggle', () => {
    const markup = render(<GuideHeader backTo="/designer" label="GUIDE" />);

    expect(markup).toContain('<button');
  });

  it('stays pinned to the top of the scrolling page', () => {
    const markup = render(<GuideHeader backTo="/designer" label="GUIDE" />);

    expect(markup).toContain(
      'sticky top-0 z-10 flex h-10 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm',
    );
  });
});
