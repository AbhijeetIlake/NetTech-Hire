import { useEffect } from "react";

/**
 * Custom hook to dynamically update document title and meta description
 * @param {string} title - The page title 
 * @param {string} description - The meta description for SEO
 */
const useDocumentMetadata = (title, description) => {
    useEffect(() => {
        const baseTitle = "NetTech Hire";
        document.title = title ? `${title} | ${baseTitle}` : baseTitle;

        if (description) {
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement("meta");
                metaDescription.name = "description";
                document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute("content", description);
        }
    }, [title, description]);
};

export default useDocumentMetadata;
