"use client";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect } from 'react';
import { useColorMode } from "./ColorModeContext";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Chart data for visualization
const chartData = [
  { month: 'Jan', value: 120, sector: 'Technology', rsi: 45, ma50: 118 },
  { month: 'Feb', value: 200, sector: 'Technology', rsi: 65, ma50: 165 },
  { month: 'Mar', value: 150, sector: 'Technology', rsi: 52, ma50: 142 },
  { month: 'Apr', value: 180, sector: 'Technology', rsi: 58, ma50: 168 },
  { month: 'May', value: 220, sector: 'Technology', rsi: 72, ma50: 195 },
  { month: 'Jun', value: 250, sector: 'Technology', rsi: 78, ma50: 225 },
  { month: 'Jul', value: 280, sector: 'Technology', rsi: 82, ma50: 255 },
  { month: 'Aug', value: 300, sector: 'Technology', rsi: 85, ma50: 275 },
  { month: 'Sep', value: 270, sector: 'Technology', rsi: 75, ma50: 250 },
  { month: 'Oct', value: 240, sector: 'Technology', rsi: 68, ma50: 230 },
  { month: 'Nov', value: 190, sector: 'Technology', rsi: 55, ma50: 185 },
  { month: 'Dec', value: 160, sector: 'Technology', rsi: 48, ma50: 155 },
  { month: 'Jan', value: 100, sector: 'Healthcare', rsi: 35, ma50: 95 },
  { month: 'Feb', value: 180, sector: 'Healthcare', rsi: 62, ma50: 155 },
  { month: 'Mar', value: 130, sector: 'Healthcare', rsi: 48, ma50: 125 },
  { month: 'Apr', value: 160, sector: 'Healthcare', rsi: 55, ma50: 150 },
  { month: 'May', value: 200, sector: 'Healthcare', rsi: 68, ma50: 185 },
  { month: 'Jun', value: 230, sector: 'Healthcare', rsi: 72, ma50: 210 },
  { month: 'Jul', value: 260, sector: 'Healthcare', rsi: 75, ma50: 235 },
  { month: 'Aug', value: 280, sector: 'Healthcare', rsi: 78, ma50: 255 },
  { month: 'Sep', value: 250, sector: 'Healthcare', rsi: 70, ma50: 235 },
  { month: 'Oct', value: 220, sector: 'Healthcare', rsi: 65, ma50: 210 },
  { month: 'Nov', value: 170, sector: 'Healthcare', rsi: 52, ma50: 165 },
  { month: 'Dec', value: 140, sector: 'Healthcare', rsi: 45, ma50: 135 },
  { month: 'Jan', value: 140, sector: 'Finance', rsi: 42, ma50: 135 },
  { month: 'Feb', value: 220, sector: 'Finance', rsi: 68, ma50: 195 },
  { month: 'Mar', value: 170, sector: 'Finance', rsi: 55, ma50: 165 },
  { month: 'Apr', value: 200, sector: 'Finance', rsi: 62, ma50: 185 },
  { month: 'May', value: 240, sector: 'Finance', rsi: 72, ma50: 220 },
  { month: 'Jun', value: 270, sector: 'Finance', rsi: 78, ma50: 245 },
  { month: 'Jul', value: 300, sector: 'Finance', rsi: 82, ma50: 270 },
  { month: 'Aug', value: 320, sector: 'Finance', rsi: 85, ma50: 290 },
  { month: 'Sep', value: 290, sector: 'Finance', rsi: 78, ma50: 265 },
  { month: 'Oct', value: 260, sector: 'Finance', rsi: 72, ma50: 240 },
  { month: 'Nov', value: 210, sector: 'Finance', rsi: 58, ma50: 195 },
  { month: 'Dec', value: 180, sector: 'Finance', rsi: 48, ma50: 170 },
];

// Calendar component
const Calendar = ({ selectedRange, onDateClick, viewLevel, onZoomIn, onZoomOut }: { 
  selectedRange: { start: Date | null; end: Date | null };
  onDateClick: (date: Date) => void;
  viewLevel: 'month' | 'week' | 'day';
  onZoomIn: () => void;
  onZoomOut: () => void;
}) => {
  const theme = useTheme();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Generate calendar days
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
  
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    onDateClick(clickedDate);
  };
  
  const renderMonthView = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<Box key={`empty-${i}`} sx={{ p: 1 }} />);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isRange = isInRange(day);
      const isStart = isStartDate(day);
      const isEnd = isEndDate(day);
      
      days.push(
        <Box
          key={day}
          onClick={() => handleDateClick(day)}
          sx={{
            p: 1,
            cursor: 'pointer',
            textAlign: 'center',
            borderRadius: 1,
            backgroundColor: isStart || isEnd 
              ? theme.palette.primary.main 
              : isRange 
                ? theme.palette.primary.light 
                : 'transparent',
            color: isStart || isEnd 
              ? theme.palette.primary.contrastText 
              : 'inherit',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
            minHeight: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {day}
        </Box>
      );
    }
    
    return days;
  };
  
  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    return weekDays.map((day, index) => {
      const isRange = selectedRange.start && selectedRange.end && 
        day >= selectedRange.start && day <= selectedRange.end;
      const isStart = selectedRange.start && day.getTime() === selectedRange.start.getTime();
      const isEnd = selectedRange.end && day.getTime() === selectedRange.end.getTime();
      
      return (
        <Box
          key={index}
          onClick={() => onDateClick(day)}
          sx={{
            p: 2,
            cursor: 'pointer',
            textAlign: 'center',
            borderRadius: 1,
            backgroundColor: isStart || isEnd 
              ? theme.palette.primary.main 
              : isRange 
                ? theme.palette.primary.light 
                : 'transparent',
            color: isStart || isEnd 
              ? theme.palette.primary.contrastText 
              : 'inherit',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
            minHeight: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption">
            {day.toLocaleDateString('en-US', { weekday: 'short' })}
          </Typography>
          <Typography variant="body2">
            {day.getDate()}
          </Typography>
        </Box>
      );
    });
  };
  
  const renderDayView = () => {
    const day = currentDate;
    const isSelected = selectedRange.start && day.getTime() === selectedRange.start.getTime();
    
    return (
      <Box
        onClick={() => onDateClick(day)}
        sx={{
          p: 3,
          cursor: 'pointer',
          textAlign: 'center',
          borderRadius: 1,
          backgroundColor: isSelected ? theme.palette.primary.main : 'transparent',
          color: isSelected ? theme.palette.primary.contrastText : 'inherit',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          minHeight: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6">
          {day.toLocaleDateString('en-US', { weekday: 'long' })}
        </Typography>
        <Typography variant="h4">
          {day.getDate()}
        </Typography>
        <Typography variant="body2">
          {day.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Typography>
      </Box>
    );
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
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" align="center" sx={{ flex: 1 }}>
          {getViewTitle()}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={onZoomOut}
            disabled={viewLevel === 'month'}
          >
            Back
          </Button>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={onZoomIn}
            disabled={viewLevel === 'day'}
          >
            Zoom
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: viewLevel === 'day' ? '1fr' : 'repeat(7, 1fr)', gap: 1 }}>
        {viewLevel === 'month' && (
          <>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Typography key={day} variant="caption" align="center" sx={{ p: 1, fontWeight: 'bold' }}>
                {day}
              </Typography>
            ))}
            {renderMonthView()}
          </>
        )}
        {viewLevel === 'week' && (
          <>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Typography key={day} variant="caption" align="center" sx={{ p: 1, fontWeight: 'bold' }}>
                {day}
              </Typography>
            ))}
            {renderWeekView()}
          </>
        )}
        {viewLevel === 'day' && renderDayView()}
      </Box>
    </Paper>
  );
};

export default function Home() {
  const colorMode = useColorMode();
  const theme = useTheme();
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedSector, setSelectedSector] = useState('Technology');
  const [compareSector, setCompareSector] = useState('');
  const [data, setData] = useState<Array<{ month: string; value: number; sector: string; rsi: number; ma50: number }>>([]);
  const [compareData, setCompareData] = useState<Array<{ month: string; value: number; sector: string; rsi: number; ma50: number }>>([]);
  const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [viewLevel, setViewLevel] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Define options inline
  const markets = ['Gold', 'Oil', 'Stocks', 'Crypto', 'Forex'];
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
  const sectors = ['Technology', 'Healthcare', 'Finance'];

  // Handle date range selection
  const handleDateClick = (clickedDate: Date) => {
    setSelectedDate(clickedDate);
    
    if (!selectedRange.start) {
      // First click - set start date
      setSelectedRange({ start: clickedDate, end: null });
    } else if (!selectedRange.end) {
      // Second click - set end date
      if (clickedDate >= selectedRange.start) {
        setSelectedRange({ start: selectedRange.start, end: clickedDate });
      } else {
        setSelectedRange({ start: clickedDate, end: selectedRange.start });
      }
    } else {
      // Third click - reset both
      setSelectedRange({ start: null, end: null });
    }
  };

  // Get technical indicators for selected date
  const getTechnicalIndicators = () => {
    if (!selectedDate) return null;
    
    // Find the month data for the selected date
    const monthIndex = selectedDate.getMonth();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[monthIndex];
    
    const monthData = data.find(d => d.month === monthName && d.sector === selectedSector);
    
    if (monthData) {
      return {
        rsi: monthData.rsi,
        ma50: monthData.ma50,
        value: monthData.value
      };
    }
    
    // Fallback dummy values
    return {
      rsi: 42,
      ma50: 1850,
      value: 200
    };
  };

  // Export data to CSV
  const exportToCSV = () => {
    if (data.length === 0) return;
    
    // Create CSV headers
    const headers = ['Month', 'Value', 'Sector', 'RSI', '50-day MA'];
    
    // Convert data to CSV rows
    const csvRows = [
      headers.join(','),
      ...data.map(row => [
        row.month,
        row.value,
        row.sector,
        row.rsi,
        row.ma50
      ].join(','))
    ];
    
    // Add comparison data if available
    if (compareData.length > 0) {
      csvRows.push(''); // Empty row for separation
      csvRows.push(...compareData.map(row => [
        row.month,
        row.value,
        row.sector,
        row.rsi,
        row.ma50
      ].join(',')));
    }
    
    // Create CSV content
    const csvContent = csvRows.join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'market-data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle zoom functionality
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

  // Simulate data fetching and filter by selected sector
  useEffect(() => {
    const fetchData = () => {
      setTimeout(() => {
        const filtered = chartData.filter(d => d.sector === selectedSector);
        setData(filtered);
      }, 1000);
    };
    
    fetchData();
  }, [selectedSector]);

  // Fetch comparison data when compare sector changes
  useEffect(() => {
    const fetchCompareData = () => {
      if (compareSector) {
        setTimeout(() => {
          const filtered = chartData.filter(d => d.sector === compareSector);
          setCompareData(filtered);
        }, 500);
      } else {
        setCompareData([]);
      }
    };
    
    fetchCompareData();
  }, [compareSector]);

  // Create combined dataset for chart
  const getCombinedChartData = () => {
    if (compareData.length === 0) {
      return data.map(item => ({
        month: item.month,
        [selectedSector]: item.value
      }));
    }
    
    // Combine both datasets by month
    const combined = data.map(item => {
      const compareItem = compareData.find(c => c.month === item.month);
      return {
        month: item.month,
        [selectedSector]: item.value,
        [compareSector]: compareItem ? compareItem.value : null
      };
    });
    
    return combined;
  };

  const technicalIndicators = getTechnicalIndicators();
  const combinedChartData = getCombinedChartData();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Theme toggle button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
          {colorMode.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>
      
      {/* Page title */}
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Market Seasonality Explorer
      </Typography>
      
      <Grid spacing={2}>
        {/* Sidebar with Paper and filters */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filter Market Data
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="market-label">Market</InputLabel>
              <Select
                labelId="market-label"
                id="market-select"
                value={selectedMarket}
                label="Market"
                onChange={e => setSelectedMarket(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {markets.map(market => (
                  <MenuItem key={market} value={market}>{market}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="season-label">Season</InputLabel>
              <Select
                labelId="season-label"
                id="season-select"
                value={selectedSeason}
                label="Season"
                onChange={e => setSelectedSeason(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {seasons.map(season => (
                  <MenuItem key={season} value={season}>{season}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" fullWidth>
              Search
            </Button>
            
            {/* Calendar */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Date Range
              </Typography>
              <Calendar 
                selectedRange={selectedRange} 
                onDateClick={handleDateClick}
                viewLevel={viewLevel}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
              />
              {selectedRange.start && (
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Start: {selectedRange.start.toLocaleDateString()}
                  {selectedRange.end && ` | End: ${selectedRange.end.toLocaleDateString()}`}
                </Typography>
              )}
            </Box>
            
            {/* Technical Indicators Panel */}
            {selectedDate && technicalIndicators && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Technical Indicators
                </Typography>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Date:</strong> {selectedDate.toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Price:</strong> ${technicalIndicators.value}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>RSI:</strong> {technicalIndicators.rsi}
                    <Box 
                      component="span" 
                      sx={{ 
                        ml: 1, 
                        color: technicalIndicators.rsi > 70 ? 'error.main' : 
                               technicalIndicators.rsi < 30 ? 'success.main' : 'text.secondary',
                        fontSize: '0.8em'
                      }}
                    >
                      {technicalIndicators.rsi > 70 ? '(Overbought)' : 
                       technicalIndicators.rsi < 30 ? '(Oversold)' : '(Neutral)'}
                    </Box>
                  </Typography>
                  <Typography variant="body2">
                    <strong>50-day MA:</strong> ${technicalIndicators.ma50}
                    <Box 
                      component="span" 
                      sx={{ 
                        ml: 1, 
                        color: technicalIndicators.value > technicalIndicators.ma50 ? 'success.main' : 'error.main',
                        fontSize: '0.8em'
                      }}
                    >
                      {technicalIndicators.value > technicalIndicators.ma50 ? '(Above MA)' : '(Below MA)'}
                    </Box>
                  </Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        </Grid>
        {/* Main Content */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Seasonality Chart
              </Typography>
              <Button 
                variant="outlined" 
                onClick={exportToCSV}
                disabled={data.length === 0}
                size="small"
              >
                Export CSV
              </Button>
            </Box>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="sector-label">Sector</InputLabel>
              <Select
                labelId="sector-label"
                id="sector-select"
                value={selectedSector}
                label="Sector"
                onChange={e => setSelectedSector(e.target.value)}
              >
                {sectors.map(sector => (
                  <MenuItem key={sector} value={sector}>{sector}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="compare-sector-label">Compare With</InputLabel>
              <Select
                labelId="compare-sector-label"
                id="compare-sector-select"
                value={compareSector}
                label="Compare With"
                onChange={e => setCompareSector(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {sectors.map(sector => (
                  <MenuItem key={sector} value={sector}>{sector}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={combinedChartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey={selectedSector} stroke="#8884d8" name={selectedSector} />
                  {compareSector && (
                    <Line type="monotone" dataKey={compareSector} stroke="#82ca9d" name={compareSector} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                  fontSize: 20,
                }}
              >
                Loading...
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
