import React from 'react';
import { Building, FolderOpen, Clock } from 'lucide-react';

interface LoaderProps {
    message?: string;
    type?: 'projects' | 'tasks' | 'data' | 'general';
    size?: 'small' | 'medium' | 'large';
}

export const Spinner: React.FC<LoaderProps> = ({
    message,
    type = 'general',
    size = 'large',
}) => {
    const getIcon = () => {
        switch (type) {
            case 'projects':
                return <FolderOpen className='w-6 h-6 text-brand-primary' />;
            case 'tasks':
                return <Clock className='w-6 h-6 text-brand-primary' />;
            case 'data':
                return <Building className='w-6 h-6 text-brand-primary' />;
            default:
                return <Building className='w-6 h-6 text-brand-primary' />;
        }
    };

    const getMessage = () => {
        if (message) return message;

        switch (type) {
            case 'projects':
                return 'Loading projects...';
            case 'tasks':
                return 'Loading tasks...';
            case 'data':
                return 'Loading data...';
            default:
                return 'Loading...';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return {
                    container: 'h-32',
                    spinner: 'w-6 h-6',
                    dots: 'w-2 h-2',
                    text: 'text-sm',
                };
            case 'medium':
                return {
                    container: 'h-72',
                    spinner: 'w-12 h-12',
                    dots: 'w-3 h-3',
                    text: 'text-base',
                };
            case 'large':
                return {
                    container: 'min-h-screen',
                    spinner: 'w-16 h-16',
                    dots: 'w-4 h-4',
                    text: 'text-lg',
                };
        }
    };

    const sizeClasses = getSizeClasses();

    return (
        <div
            className={`${sizeClasses.container} bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex items-center justify-center p-6`}
        >
            <div className='text-center'>
                {/* Main Loading Animation */}

                {/* Icon */}
                {/* <div className='mb-4'>
          <div className='w-12 h-12 bg-white rounded-xl shadow-sm border border-neutral-200 flex items-center justify-center mx-auto'>
            {getIcon()}
          </div>
        </div> */}

                {/* Loading Text */}
                <h3
                    className={`font-semibold text-neutral-900 mb-2 ${sizeClasses.text}`}
                >
                    {getMessage()}
                </h3>

                {/* Subtitle */}
                <p className='text-sm text-neutral-600 mb-6 max-w-xs mx-auto'>
                    Please wait while we fetch your data
                </p>

                {/* Animated Dots */}
                <div className='flex items-center justify-center gap-2'>
                    <div
                        className={`${sizeClasses.dots} bg-brand-primary rounded-full animate-bounce`}
                        style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
                    ></div>
                    <div
                        className={`${sizeClasses.dots} bg-brand-primary rounded-full animate-bounce`}
                        style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
                    ></div>
                    <div
                        className={`${sizeClasses.dots} bg-brand-primary rounded-full animate-bounce`}
                        style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
                    ></div>
                </div>

                {/* Progress Indicator */}
                {/* <div className='mt-8 w-48 mx-auto'>
          <div className='h-1 bg-neutral-200 rounded-full overflow-hidden'>
            <div
              className='h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full animate-pulse'
              style={{
                animation: 'loading-bar 2s ease-in-out infinite',
              }}
            ></div>
          </div>
        </div> */}
            </div>


        </div>
    );
};
