

import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormRespond from '../FormRespond';

describe('FormRespond', () => {
  beforeEach(() => { jest.clearAllMocks(); });
  it('レンダリングできる', () => {
    render(
      <MemoryRouter>
        <FormRespond />
      </MemoryRouter>
    );
  });
});
