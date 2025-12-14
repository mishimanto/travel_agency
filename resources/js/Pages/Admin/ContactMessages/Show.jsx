import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ message }) {
    return (
        <AdminLayout title="Message">
            <Head title="View Message" />

            <Link
                href={route('admin.contact-messages.index')}
                className="text-sm text-blue-600 hover:underline"
            >
                Back
            </Link>

            <div className="mt-4 bg-white p-6 rounded shadow">
                {/* <h2 className="text-lg font-semibold mb-2">{message.subject}</h2> */}

                <p><strong>Name:</strong> {message.name}</p>
                <p><strong>Email:</strong> {message.email}</p>
                <p><strong>Phone:</strong> {message.phone ?? 'N/A'}</p>
                <p><strong>Subject:</strong> {message.subject ?? 'N/A'}</p>

                <p className="mt-4 text-gray-700 whitespace-pre-line">
                    <strong>Message:</strong> {message.message}
                </p>

                <p className="mt-4 text-sm text-gray-500">
                    Sent on:{' '}
                    {new Date(message.created_at).toLocaleString('en-US')}
                </p>
            </div>
        </AdminLayout>
    );
}
