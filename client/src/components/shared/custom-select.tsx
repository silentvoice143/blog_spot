import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Check, ChevronsUpDown, Search, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Loader from '@/components/ui/loader';
import { useDebounce } from '@/hooks/useDebounce';

export interface Option {
    label: string;
    value: string;
    id?: string;
}

interface DropdownSearchProps {
    options: Option[];
    multiSelect?: boolean;
    placeholder?: string;
    selected?: string | string[];
    onChange?: (selected: string | string[]) => void;
    onChangeV1?: (selected: Option | Option[]) => void;
    label?: string;
    labelClassName?: string;
    triggerClassName?: string;
    menuClassName?: string;
    disabled?: boolean;
    searchValue?: string;
    onChangeSearch?: React.Dispatch<React.SetStateAction<string>>;
    required?: boolean;
    error?: string;
    height?: string;
    customSelectHandler?: (value: string, prevSelection: string[]) => string[];
    showSearch?: boolean;
    loading?: boolean;
    onPageChange?: () => void;
    customMessage?: string;
    readOnlyValues?: string[];
    enableCreateOption?: boolean;
    onCreateOption?: (value: string) => void;

}

export function CustomSelect({
    options,
    multiSelect = false,
    placeholder = 'Select...',
    selected,
    onChange,
    onChangeV1,
    label,
    labelClassName = '',
    triggerClassName = '',
    menuClassName = '',
    disabled = false,
    required = false,
    error = '',
    height = 'h-10',
    showSearch = true,
    searchValue,
    onChangeSearch,
    customSelectHandler,
    loading,
    onPageChange,
    customMessage,
    readOnlyValues = [],
    enableCreateOption,
    onCreateOption,

}: DropdownSearchProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [search, setSearch] = useState(searchValue ? searchValue : "");
    const [selection, setSelection] = useState<string[]>(() => {
        if (multiSelect) {
            return Array.isArray(selected) ? selected : [];
        } else {
            return selected && typeof selected === 'string' ? [selected] : [];
        }
    });
    const [selectionV1, setSelectionV1] = useState<Option[]>([]);

    const triggerRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [triggerWidth, setTriggerWidth] = useState<number>(0);

    // Update selection when props change
    // useEffect(() => {
    //   if (multiSelect) {
    //     setSelection(Array.isArray(selected) ? selected : []);
    //   } else {
    //     setSelection(selected ? [selected as string] : []);
    //   }
    // }, [selected, multiSelect]);

    useEffect(() => {
        if (multiSelect) {
            setSelection(Array.isArray(selected) ? selected : []);
            setSelectionV1(
                Array.isArray(selected)
                    ? options.filter(opt => selected.includes(opt.value))
                    : []
            );
        } else {
            const selectedValue =
                selected && typeof selected === 'string' ? selected : '';
            setSelection(selectedValue ? [selectedValue] : []);
            const selectedObj = options.find(opt => opt.value === selectedValue);
            setSelectionV1(selectedObj ? [selectedObj] : []);
        }
    }, [selected, multiSelect, options]);

    // Update trigger width
    useEffect(() => {
        const updateWidth = () => {
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                setTriggerWidth(rect.width);
            }
        };

        if (open) {
            updateWidth();
            window.addEventListener('resize', updateWidth);
            return () => window.removeEventListener('resize', updateWidth);
        }
    }, [open]);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (open && searchInputRef.current) {
            const timer = setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [open]);

    // Clear search when dropdown closes
    useEffect(() => {
        if (!open) {
            setSearch('');
        }
    }, [open]);

    const filteredOptions = useMemo(() => {
        if (!search.trim()) return options;
        return options.filter(opt =>
            opt.label.toLowerCase().includes(search.toLowerCase().trim())
        );
    }, [search, options]);

    // const toggleSelect = (value: string) => {
    //   if (multiSelect) {
    //     const newSelection = selection.includes(value)
    //       ? selection.filter(v => v !== value)
    //       : [...selection, value];
    //     setSelection(newSelection);
    //     onChange(newSelection);
    //   } else {
    //     setSelection([value]);
    //     onChange(value);
    //     setOpen(false);
    //   }
    // };

    const toggleSelect = (value: string) => {
        if (multiSelect) {
            const newSelection = customSelectHandler
                ? customSelectHandler(value, selection)
                : selection.includes(value)
                    ? selection.filter(v => v !== value)
                    : [...selection, value];

            setSelection(newSelection);
            onChange && onChange(newSelection);
        } else {
            setSelection([value]);
            onChange && onChange(value);
            setOpen(false);
        }
    };

    const toggleSelectV1 = (value: string) => {
        const option = options.find(opt => opt.value === value);
        if (!option) return;

        if (multiSelect) {
            const newValueSelection = customSelectHandler
                ? customSelectHandler(value, selection)
                : selection.includes(value)
                    ? selection.filter(v => v !== value)
                    : [...selection, value];

            const newObjectSelection = options.filter(opt =>
                newValueSelection.includes(opt.value)
            );

            setSelection(newValueSelection);
            setSelectionV1(newObjectSelection);

            onChange?.(newValueSelection);
            onChangeV1?.(newObjectSelection);
        } else {
            setSelection([value]);
            setSelectionV1([option]);

            onChange?.(value);
            onChangeV1?.(option);
            setOpen(false);
        }
    };

    const handleScroll = (e: any) => {
        const target = e.currentTarget;
        const nearBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight < 25;

        if (nearBottom && !loading) {
            onPageChange?.();
        }
    };

    const handleCreateOption = () => {
        const trimmed = search.trim();

        if (!trimmed) return;

        const newOption: Option = {
            label: trimmed,
            value: trimmed.toLowerCase().replace(/\s+/g, '-'),
        };

        onCreateOption?.(trimmed);

        if (multiSelect) {
            const updatedSelection = [...selection, newOption.value];

            setSelection(updatedSelection);

            onChange?.(updatedSelection);

            if (onChangeV1) {
                setSelectionV1(prev => [...prev, newOption]);
                onChangeV1([...selectionV1, newOption]);
            }
        } else {
            setSelection([newOption.value]);

            onChange?.(newOption.value);

            if (onChangeV1) {
                setSelectionV1([newOption]);
                onChangeV1(newOption);
            }

            setOpen(false);
        }

        setSearch('');
    };

    const renderLabel = () => {
        if (selection.length === 0) return placeholder;
        if (multiSelect) {
            if (selection.length > 3) return `${selection.length} items selected`;
            return options
                .filter(opt => selection.includes(opt.value))
                .map(opt => opt.label)
                .join(', ');
        } else {
            return (
                options.find(opt => opt.value === selection[0])?.label ?? placeholder
            );
        }
    };

    const hasError = Boolean(error);
    const hasValue = selection.length > 0;

    const getTriggerClasses = () => {
        let classes = `relative flex ${height} w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm font-medium transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary`;

        if (hasError) {
            classes += ' border-red-400 ring-2 ring-red-100';
        } else if (open) {
            classes += ' border-brand-primary ring-2 ring-brand-primary/20';
        } else if (hasValue) {
            classes += ' border-neutral-300 hover:border-brand-primary/60';
        } else {
            classes += ' border-neutral-300 hover:border-neutral-400';
        }

        if (disabled) {
            classes +=
                ' bg-neutral-50 border-neutral-200 cursor-not-allowed opacity-60';
        } else {
            classes += ' hover:bg-neutral-50/50 cursor-pointer';
        }

        if (selection.length === 0) {
            classes += ' text-neutral-500';
        } else {
            classes += ' text-neutral-900';
        }

        return `${classes} ${triggerClassName}`;
    };

    const getOptionClasses = (isSelected: boolean) => {
        let classes =
            'w-full flex items-center justify-between px-4 py-1.5 text-sm text-left transition-colors duration-150 group focus:outline-none focus:bg-brand-primary/5';

        if (isSelected) {
            classes +=
                ' bg-brand-primary/10 hover:bg-brand-primary/15 text-brand-primary border-l-2 border-l-brand-primary cursor-pointer';
        } else {
            classes +=
                ' hover:bg-neutral-100 text-neutral-900 border-l-2 border-l-transparent cursor-pointer';
        }

        return classes;
    };

    return (
        <div className='w-full space-y-1 px-0.5'>
            {label && (
                <label
                    className={`block text-sm font-medium transition-colors duration-200 ${hasError ? 'text-red-700' : 'text-neutral-700'
                        } ${labelClassName}`}
                >
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild disabled={disabled}>
                    <button
                        disabled={disabled}
                        ref={triggerRef}
                        className={getTriggerClasses()}
                        type='button'
                        aria-expanded={open}
                        aria-haspopup='listbox'
                        aria-label={label || placeholder}
                    >
                        <span className='block truncate flex-1 text-left'>
                            {renderLabel()}
                        </span>
                        <ChevronsUpDown
                            className={`ml-2 h-4 w-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''
                                } ${hasError ? 'text-red-400' : 'text-neutral-400'}`}
                        />
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    className={`p-0 shadow-lg border border-neutral-200 bg-white`}
                    style={{ width: triggerWidth > 0 ? `${triggerWidth}px` : 'auto' }}
                    align='start'
                    sideOffset={4}
                    onOpenAutoFocus={e => e.preventDefault()}
                >
                    {/* Search Header */}
                    {showSearch && (
                        <div className='p-3 border-b border-neutral-100 bg-neutral-50/50'>
                            <div className='relative'>
                                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400' />
                                <input
                                    ref={searchInputRef}
                                    type='text'
                                    placeholder='Search options...'
                                    value={search}
                                    onChange={e => {
                                        setSearch(e.target.value);
                                        onChangeSearch(useDebounce(e.target.value, 500))
                                    }}
                                    className='w-full h-10 pl-10 pr-4 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white placeholder-neutral-400'
                                    onKeyDown={e => {
                                        if (
                                            e.key === 'ArrowDown' ||
                                            e.key === 'ArrowUp' ||
                                            e.key === 'Enter'
                                        ) {
                                            e.preventDefault();
                                        }
                                        if (e.key === 'Escape') {
                                            setOpen(false);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Options List */}
                    <div
                        className={`max-h-60 overflow-y-auto overflow-x-hidden ${menuClassName}`}
                        onWheel={e => e.stopPropagation()}
                        onTouchMove={e => e.stopPropagation()}
                        onScroll={handleScroll}
                    >
                        {filteredOptions.length === 0 ? (
                            !loading && (
                                <div className='px-3 py-3'>
                                    {enableCreateOption && search.trim() ? (
                                        <button
                                            type='button'
                                            onClick={handleCreateOption}
                                            className='w-full rounded-lg border border-dashed border-brand-primary bg-brand-primary/5 px-4 py-3 text-left transition hover:bg-brand-primary/10'
                                        >
                                            <p className='text-sm font-medium text-brand-primary'>
                                                Create "{search}"
                                            </p>

                                            <p className='text-xs text-neutral-500 mt-1'>
                                                No matching option found
                                            </p>
                                        </button>
                                    ) : customMessage ? (
                                        <div className='text-center'>
                                            <p className='text-xs text-neutral-400'>
                                                {customMessage}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className='flex flex-col items-center gap-2 py-4'>
                                            <Search className='h-8 w-8 text-neutral-300' />

                                            <p className='text-sm text-neutral-500 font-medium'>
                                                No results found
                                            </p>

                                            <p className='text-xs text-neutral-400'>
                                                Try adjusting your search terms
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )
                        ) : (
                            <div className='py-1'>
                                {filteredOptions.map(
                                    ({ label: optionLabel, value, id }, idx) => {
                                        const isSelected = selection.includes(value);
                                        const isReadOnly = readOnlyValues.includes(value);

                                        return (
                                            <button
                                                disabled={isReadOnly}
                                                key={`${value}-${idx}`}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    onChangeV1
                                                        ? toggleSelectV1(value)
                                                        : toggleSelect(value);
                                                }}
                                                onMouseDown={e => e.preventDefault()}
                                                className={`${getOptionClasses(isSelected)} ${isReadOnly ? 'cursor-default opacity-60 bg-neutral-300 hover:bg-neutral-300' : ''}`}
                                                type='button'
                                                role='option'
                                                aria-selected={isSelected}
                                            >
                                                <span className='truncate font-medium'>
                                                    {optionLabel}
                                                </span>

                                                {isSelected && (
                                                    <div className='flex items-center gap-1'>
                                                        <Check className='h-4 w-4 text-brand-primary' />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        )}
                        {loading && <Loader />}
                    </div>

                    {/* Footer for multi-select */}
                    {multiSelect && selection.length > 0 && (
                        <div className='px-4 py-2 border-t border-neutral-100 bg-neutral-50/50'>
                            <p className='text-xs text-neutral-600'>
                                {selection.length} item{selection.length !== 1 ? 's' : ''}{' '}
                                selected
                            </p>
                        </div>
                    )}
                </PopoverContent>
            </Popover>

            {/* Error Message */}
            {hasError && (
                <p className='text-sm text-red-600 flex items-center gap-1 mt-1'>
                    <AlertCircle size={14} />
                    {error}
                </p>
            )}
        </div>
    );
}
