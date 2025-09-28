import { useNotification } from "@/components/Notifications/NotificationContext";

// This appears to be a test component.
// It calls hooks at the top level, which is not standard React practice.
// You might want to wrap this logic inside a component function if you intend to use it.
const SampleNotification = () => {
    const { addNotification } = useNotification();

    const handleClick = () => {
        const newNotification = {
            id: Date.now().toString(),
            type: "success",
            message: "Login Successful",
        };
        addNotification(newNotification);
    };

    // Example of how you might use this in a button
    return (
        <button onClick={handleClick}>Show Sample Notification</button>
    );
}

export default SampleNotification;