import { render } from '@testing-library/react';
import { Skeleton } from '@/components/ui/skeleton';

describe('Skeleton Component', () => {
  it('should render with default classes', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('animate-pulse');
    expect(skeleton).toHaveClass('rounded-md');
    expect(skeleton).toHaveClass('bg-gray-200');
  });

  it('should apply custom className', () => {
    const { container } = render(<Skeleton className="w-full h-20" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass('w-full');
    expect(skeleton).toHaveClass('h-20');
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('should render as a div element', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild;

    expect(skeleton?.nodeName).toBe('DIV');
  });
});
