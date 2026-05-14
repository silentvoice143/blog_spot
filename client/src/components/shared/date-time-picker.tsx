"use client";

import * as React from "react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface DateTimePickerProps {
    value?: Date;
    onChange?: (date: Date) => void;
    onSubmit?: () => void;
    onCancel?: () => void;

    /**
     * Custom trigger element
     */
    children: React.ReactNode;
}

export function DateTimePicker({
    value,
    onChange,
    children,
    onSubmit, onCancel
}: DateTimePickerProps) {
    const [open, setOpen] = React.useState(false)
    function handleDateSelect(date: Date | undefined) {
        if (!date) return;

        const current = value || new Date();

        date.setHours(current.getHours());
        date.setMinutes(current.getMinutes());

        onChange?.(date);
    }

    function handleTimeChange(
        type: "hour" | "minute" | "ampm",
        selectedValue: string
    ) {
        const currentDate = value || new Date();
        const newDate = new Date(currentDate);

        if (type === "hour") {
            const selectedHour = parseInt(selectedValue, 10);
            const currentHours = newDate.getHours();
            const isPM = currentHours >= 12;

            let updatedHour = selectedHour % 12;

            if (isPM) updatedHour += 12;

            newDate.setHours(updatedHour);
        }

        if (type === "minute") {
            newDate.setMinutes(parseInt(selectedValue, 10));
        }

        if (type === "ampm") {
            const hours = newDate.getHours();

            if (selectedValue === "AM" && hours >= 12) {
                newDate.setHours(hours - 12);
            }

            if (selectedValue === "PM" && hours < 12) {
                newDate.setHours(hours + 12);
            }
        }

        onChange?.(newDate);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>

            <PopoverContent align="end" className="w-auto p-0 z-[9999999]">
                <div className="sm:flex">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={handleDateSelect}

                    />

                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        {/* Hours */}
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i + 1)
                                    .reverse()
                                    .map((hour) => {
                                        const isSelected =
                                            value &&
                                            ((value.getHours() % 12 || 12) === hour);

                                        return (
                                            <Button
                                                key={hour}
                                                type="button"
                                                size="icon"
                                                variant={isSelected ? "default" : "ghost"}
                                                className="sm:w-full shrink-0 aspect-square"
                                                onClick={() =>
                                                    handleTimeChange("hour", hour.toString())
                                                }
                                            >
                                                {hour}
                                            </Button>
                                        );
                                    })}
                            </div>

                            <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                            />
                        </ScrollArea>

                        {/* Minutes */}
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i * 5).map(
                                    (minute) => {
                                        const isSelected =
                                            value && value.getMinutes() === minute;

                                        return (
                                            <Button
                                                key={minute}
                                                type="button"
                                                size="icon"
                                                variant={isSelected ? "default" : "ghost"}
                                                className="sm:w-full shrink-0 aspect-square"
                                                onClick={() =>
                                                    handleTimeChange(
                                                        "minute",
                                                        minute.toString()
                                                    )
                                                }
                                            >
                                                {minute.toString().padStart(2, "0")}
                                            </Button>
                                        );
                                    }
                                )}
                            </div>

                            <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                            />
                        </ScrollArea>

                        {/* AM / PM */}
                        <ScrollArea>
                            <div className="flex sm:flex-col p-2">
                                {["AM", "PM"].map((ampm) => {
                                    const isSelected =
                                        value &&
                                        ((ampm === "AM" && value.getHours() < 12) ||
                                            (ampm === "PM" && value.getHours() >= 12));

                                    return (
                                        <Button
                                            key={ampm}
                                            type="button"
                                            size="icon"
                                            variant={isSelected ? "default" : "ghost"}
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() =>
                                                handleTimeChange("ampm", ampm)
                                            }
                                        >
                                            {ampm}
                                        </Button>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
                <div className="py-2 px-4 flex justify-end gap-4">
                    <Button onClick={() => {
                        onCancel && onCancel();
                        setOpen(false)
                    }} className="h-8 rounded-full">Cancel</Button><Button onClick={() => {
                        onSubmit && onSubmit();
                        setOpen(false)
                    }} className="h-8 rounded-full">Submit</Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}