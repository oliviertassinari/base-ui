import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, screen, cleanup } from '@testing-library/react';
import { describe } from 'vitest';
import { Tooltip } from '@base-ui-components/react/tooltip';
import { options } from '../utils/options';
import { bench } from '../utils/bench';

describe('Tooltip', () => {
  bench(
    'Tooltip with 2,000 items',
    async () => {
      function Item(props: any) {
        return <span>{`Item ${props.idx} - ${Math.random()}`}</span>;
      }

      function BaseItemWithTooltip(props: any) {
        return (
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Item idx={props.idx} />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner>
                <Tooltip.Popup className="TooltipContent">This is title</Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        );
      }

      render(
        <Tooltip.Provider>
          <div>
            {Array.from({ length: 2000 }).map((_, idx) => (
              <BaseItemWithTooltip key={idx} idx={idx} />
            ))}
            Rendered
          </div>
        </Tooltip.Provider>,
      );

      await screen.findByText('rendered');

      cleanup();
    },
    options,
  );
});
