import clsx from 'clsx'
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type InputHTMLAttributes,
} from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { zhCN } from 'date-fns/locale/zh-CN'
import HudInput from '../hud/HudInput'
import { fromDateToStorage, parseDateTimeValue } from '../../lib/dateTimeValue'
import HudTimeInput, { parseTimeParts } from './HudTimeInput'

let localeRegistered = false

interface TimeInputBridgeProps {
  date?: Date
  value?: string
  onChange?: (time: string) => void
}

type ApplyTimeChange = (time: string, date?: Date) => void

const TimePickerStoreContext = createContext<ApplyTimeChange | null>(null)

/** 稳定 customTimeInput 元素，避免父级重渲染导致时间面板被卸载 */
function TimeInputBridge({ date, value }: TimeInputBridgeProps) {
  const applyTime = useContext(TimePickerStoreContext)
  return (
    <HudTimeInput
      date={date}
      value={value}
      onChange={(time) => {
        applyTime?.(time, date)
      }}
    />
  )
}

const STABLE_CUSTOM_TIME_INPUT = <TimeInputBridge />

function ensureLocale() {
  if (localeRegistered) return
  registerLocale('zh-CN', zhCN)
  localeRegistered = true
}

interface HudDateTimePickerProps {
  value: string
  onChange: (value: string) => void
  storageFormat?: 'filter' | 'param'
  className?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  placeholder?: string
}

interface PickerInputProps extends InputHTMLAttributes<HTMLInputElement> {
  compact?: boolean
}

const PickerInput = forwardRef<HTMLInputElement, PickerInputProps>(function PickerInput(
  { className, compact, ...props },
  ref,
) {
  return (
    <HudInput
      ref={ref}
      compact={compact}
      readOnly
      className={clsx('hud-datepicker-input', className)}
      {...props}
    />
  )
})

function HudDateTimePicker({
  value,
  onChange,
  storageFormat = 'filter',
  className,
  disabled,
  minDate,
  maxDate,
  placeholder = '选择日期时间',
}: HudDateTimePickerProps) {
  ensureLocale()

  const selected = useMemo(() => parseDateTimeValue(value), [value])
  const selectedRef = useRef(selected)
  const onChangeRef = useRef(onChange)
  const storageFormatRef = useRef(storageFormat)
  selectedRef.current = selected
  onChangeRef.current = onChange
  storageFormatRef.current = storageFormat

  const applyTime = useCallback((time: string, date?: Date) => {
    const parts = parseTimeParts(time, date)
    const base =
      date instanceof Date && !Number.isNaN(date.getTime())
        ? new Date(date)
        : selectedRef.current
          ? new Date(selectedRef.current)
          : new Date()
    base.setHours(parts.hours, parts.minutes, parts.seconds, 0)
    onChangeRef.current(fromDateToStorage(base, storageFormatRef.current))
  }, [])

  return (
    <TimePickerStoreContext.Provider value={applyTime}>
      <DatePicker
        selected={selected}
        onChange={(date: Date | null) => {
          if (!date) return
          onChange(fromDateToStorage(date, storageFormat))
        }}
        locale="zh-CN"
        showTimeInput
        timeInputLabel="时间:"
        customTimeInput={STABLE_CUSTOM_TIME_INPUT}
        dateFormat="yyyy-MM-dd HH:mm:ss"
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        placeholderText={placeholder}
        showIcon={false}
        showPopperArrow={false}
        calendarClassName="hud-datepicker-surface"
        portalId="hud-datepicker-portal"
        popperClassName="hud-datepicker-popper"
        popperProps={{ strategy: 'fixed' }}
        customInput={<PickerInput className={className} />}
      />
    </TimePickerStoreContext.Provider>
  )
}

export default HudDateTimePicker
