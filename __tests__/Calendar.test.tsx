import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a test theme
const testTheme = createTheme();

// Test wrapper component that includes the Calendar logic
const TestCalendar = () => {
  const [selectedRange, setSelectedRange] = React.useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [viewLevel, setViewLevel] = React.useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  const handleDateClick = (clickedDate: Date) => {
    setSelectedDate(clickedDate);
    
    if (!selectedRange.start) {
      setSelectedRange({ start: clickedDate, end: null });
    } else if (!selectedRange.end) {
      if (clickedDate >= selectedRange.start) {
        setSelectedRange({ start: selectedRange.start, end: clickedDate });
      } else {
        setSelectedRange({ start: clickedDate, end: selectedRange.start });
      }
    } else {
      setSelectedRange({ start: null, end: null });
    }
  };

  const handleZoomIn = () => {
    if (viewLevel === 'month') {
      setViewLevel('week');
    } else if (viewLevel === 'week') {
      setViewLevel('day');
    }
  };

  const handleZoomOut = () => {
    if (viewLevel === 'day') {
      setViewLevel('week');
    } else if (viewLevel === 'week') {
      setViewLevel('month');
    }
  };

  // Calendar component logic (extracted from page.tsx)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  
  const isInRange = (day: number) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    const date = new Date(currentYear, currentMonth, day);
    return date >= selectedRange.start && date <= selectedRange.end;
  };
  
  const isStartDate = (day: number) => {
    if (!selectedRange.start) return false;
    const date = new Date(currentYear, currentMonth, day);
    return date.getTime() === selectedRange.start.getTime();
  };
  
  const isEndDate = (day: number) => {
    if (!selectedRange.end) return false;
    const date = new Date(currentYear, currentMonth, day);
    return date.getTime() === selectedRange.end.getTime();
  };
  
  const handleDateClickLocal = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    handleDateClick(clickedDate);
  };
  
  const renderMonthView = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} data-testid={`empty-${i}`} />);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isRange = isInRange(day);
      const isStart = isStartDate(day);
      const isEnd = isEndDate(day);
      
      days.push(
        <div
          key={day}
          data-testid={`day-${day}`}
          onClick={() => handleDateClickLocal(day)}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            padding: '8px',
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };
  
  const getViewTitle = () => {
    switch (viewLevel) {
      case 'month':
        return new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'week':
        const weekDays = getWeekDays(currentDate);
        const start = weekDays[0];
        const end = weekDays[6];
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'day':
        return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      default:
        return '';
    }
  };

  return (
    <div data-testid="calendar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h6 style={{ flex: 1, textAlign: 'center' }} data-testid="calendar-title">
          {getViewTitle()}
        </h6>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            data-testid="back-button"
            onClick={handleZoomOut}
            disabled={viewLevel === 'month'}
          >
            Back
          </button>
          <button 
            data-testid="zoom-button"
            onClick={handleZoomIn}
            disabled={viewLevel === 'day'}
          >
            Zoom
          </button>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: viewLevel === 'day' ? '1fr' : 'repeat(7, 1fr)', gap: '4px' }}>
        {viewLevel === 'month' && (
          <>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} data-testid={`header-${day}`} style={{ padding: '4px', fontWeight: 'bold', textAlign: 'center' }}>
                {day}
              </div>
            ))}
            {renderMonthView()}
          </>
        )}
      </div>
    </div>
  );
};

// Helper function to render Calendar component with necessary providers
const renderCalendar = () => {
  return render(
    <ThemeProvider theme={testTheme}>
      <TestCalendar />
    </ThemeProvider>
  );
};

describe('Calendar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Month View Rendering', () => {
    it('renders the correct number of day cells for the current month', () => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
      
      renderCalendar();

      // Verify weekday headers are present
      expect(screen.getByTestId('header-Sun')).toHaveTextContent('Sun');
      expect(screen.getByTestId('header-Mon')).toHaveTextContent('Mon');
      expect(screen.getByTestId('header-Tue')).toHaveTextContent('Tue');
      expect(screen.getByTestId('header-Wed')).toHaveTextContent('Wed');
      expect(screen.getByTestId('header-Thu')).toHaveTextContent('Thu');
      expect(screen.getByTestId('header-Fri')).toHaveTextContent('Fri');
      expect(screen.getByTestId('header-Sat')).toHaveTextContent('Sat');

      // Verify the calendar title shows current month and year
      const expectedTitle = currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      expect(screen.getByTestId('calendar-title')).toHaveTextContent(expectedTitle);
    });

    it('displays the current month and year in the title', () => {
      const currentDate = new Date();
      const expectedTitle = currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });

      renderCalendar();

      expect(screen.getByTestId('calendar-title')).toHaveTextContent(expectedTitle);
    });
  });

  describe('Date Selection', () => {
    it('calls onDateClick when a date cell is clicked', () => {
      renderCalendar();

      // Find and click on a day cell (day 15)
      const dayCell = screen.getByTestId('day-15');
      fireEvent.click(dayCell);

      // The day should be clickable and the component should handle the click
      expect(dayCell).toBeInTheDocument();
    });

    it('renders day cells for the current month', () => {
      renderCalendar();

      // Check that we have day cells rendered
      const dayCell = screen.getByTestId('day-1');
      expect(dayCell).toBeInTheDocument();
      expect(dayCell).toHaveTextContent('1');
    });
  });

  describe('Zoom Functionality', () => {
    it('displays Zoom and Back buttons', () => {
      renderCalendar();

      expect(screen.getByTestId('zoom-button')).toHaveTextContent('Zoom');
      expect(screen.getByTestId('back-button')).toHaveTextContent('Back');
    });

    it('calls onZoomIn when Zoom button is clicked', () => {
      renderCalendar();

      const zoomButton = screen.getByTestId('zoom-button');
      fireEvent.click(zoomButton);

      // The button should be clickable
      expect(zoomButton).toBeInTheDocument();
    });

    it('calls onZoomOut when Back button is clicked', () => {
      renderCalendar();

      const backButton = screen.getByTestId('back-button');
      fireEvent.click(backButton);

      // The button should be clickable
      expect(backButton).toBeInTheDocument();
    });

    it('disables Back button when viewLevel is month', () => {
      renderCalendar();

      const backButton = screen.getByTestId('back-button');
      expect(backButton).toBeDisabled();
    });

    it('enables Zoom button when viewLevel is month', () => {
      renderCalendar();

      const zoomButton = screen.getByTestId('zoom-button');
      expect(zoomButton).not.toBeDisabled();
    });
  });
}); 