import AdminLayout from '@/Layouts/AdminLayout';
import { Link, Head } from '@inertiajs/react';

export default function Index({ messages }) {
    return (
        <AdminLayout title="Messages">
            <Head title="Contact Messages" />

            {/* <h1 className="text-xl font-semibold mb-4">Contact Messages</h1> */}

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Subject</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.data.map((msg) => (
                            <tr key={msg.id} className="border-t">
                                <td className="px-4 py-2">{msg.name}</td>
                                <td className="px-4 py-2">{msg.email}</td>
                                <td className="px-4 py-2">{msg.subject}</td>
                                <td className="px-4 py-2">
                                    {new Date(msg.created_at).toLocaleDateString('en-US')}
                                </td>
                                <td className="px-4 py-2">
                                    <Link
                                        href={route('admin.contact-messages.show', msg.id)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex gap-2">
                {messages.links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url || '#'}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-3 py-1 border rounded ${
                            link.active ? 'bg-blue-600 text-white' : ''
                        } ${!link.url && 'text-gray-400'}`}
                    />
                ))}
            </div>
        </AdminLayout>
    );
}
