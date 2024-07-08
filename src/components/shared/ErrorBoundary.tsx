// import React, { ErrorInfo, ReactElement, useEffect } from "react";
// // import toast, { Toaster } from "react-hot-toast";

// interface ErrorBoundaryState {
//     hasError: boolean;
//     errorMessage: string;
// }

// interface ErrorboundaryProps {
//     children: ReactElement;
// }

// export class ErrorBoundaries extends React.Component<ErrorboundaryProps, ErrorBoundaryState> {
//     constructor(props: ErrorboundaryProps) {
//         super(props);
//         this.state = {
//             hasError: false,
//             errorMessage: ""
//         };
//     }

//     componentDidCatch(error: Error, errorInfo: ErrorInfo) {
//         this.setState({ hasError: true });
//         this.setState({ errorMessage: error.message });
//         toast.error(`Error: ${error.message}`);
//     }

//     render(): React.ReactNode {
//         if (this.state?.hasError) {
//             return null; // Return null here as we'll be showing errors in toasts
//         }
//         return (
//             <React.Fragment>
//                 <Toaster position="top-right" />
//                 {this.props.children}
//             </React.Fragment>
//         );
//     }
// }

// // Custom hook to wrap useEffect and catch errors
// export const useFetchData = (fetchFunction: (...args: any[]) => Promise<any>, errorMessage?: string, ...props: any[]) => {
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 await fetchFunction(...props); // Pass props to fetchFunction
//             } catch (error: any) {
//                 toast.error(`Error fetching data: ${error.message}`);
//             }
//         };

//         fetchData();
//     }, [fetchFunction, ...props]); // Include props in the dependency array
// };
