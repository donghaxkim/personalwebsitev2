import Tooltip from '@mui/material/Tooltip'

const GlossaryTooltip = ({ term, definition, theme, children }) => {
  const tooltipSlotProps = {
    popper: {
      sx: {
        '& .MuiTooltip-tooltip': {
          fontFamily: "'Karla', sans-serif",
          bgcolor: theme === 'dark' ? 'rgb(200, 200, 200)' : 'rgb(38, 38, 38)',
          color: theme === 'dark' ? 'rgb(30, 30, 30)' : 'white',
          fontSize: '0.8125rem',
          fontWeight: 500,
          px: 1,
          py: 0.5,
          borderRadius: '8px',
          boxShadow: 'none',
          maxWidth: 260,
        },
      },
    },
  }

  const tooltipContent = (
    <>
      <span style={{ display: 'block', fontWeight: 600 }}>{term}</span>
      <span
        style={{
          display: 'block',
          fontSize: '0.75rem',
          fontWeight: 400,
          opacity: 0.7,
          lineHeight: 1.5,
          marginTop: 2,
        }}
      >
        {definition}
      </span>
    </>
  )

  return (
    <Tooltip title={tooltipContent} placement="bottom" enterDelay={200} slotProps={tooltipSlotProps}>
      <span
        className={`border-b border-dotted cursor-help transition-colors duration-200 ${
          theme === 'dark'
            ? 'border-white/30 hover:bg-white/15'
            : 'border-black/30 hover:bg-black/10'
        }`}
      >
        {children}
      </span>
    </Tooltip>
  )
}

export default GlossaryTooltip