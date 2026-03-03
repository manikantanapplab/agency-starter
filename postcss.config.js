import autoprefixer from 'autoprefixer';

const isProd = process.env.NODE_ENV === 'production';

const plugins = [autoprefixer];

if (isProd) {
  const { default: purgecss } = await import('@fullhuman/postcss-purgecss');
  const { default: cssnano }   = await import('cssnano');

  plugins.push(
    purgecss({
      content: [
        './src/**/*.pug',
        './src/**/*.js',
        './src/**/*.html',
        './src/**/*.mjs',
      ],
      safelist: {
        standard: [
          'show', 'showing', 'hide', 'hiding',
          'active', 'disabled', 'collapsed', 'collapsing',
          'fade', 'open', 'is-scrolled',
        ],
        greedy: [
          /^navbar/,
          /^dropdown/,
          /^collapse/,
          /^modal/,
          /^bs-/,
        ],
        deep: [
          /^html/,
          /^body/,
        ],
        keyframes: true,
        variables: true,
      },
    })
  );

  plugins.push(
    cssnano({
      preset: ['default', {
        discardComments: { removeAll: true },
        reduceIdents: false,
      }],
    })
  );
}

export default { plugins };
