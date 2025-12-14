<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            background: #fff;
            font-size: 12px;
            margin: 0;
        }

        .wrapper-invoice {
        
        }

        .invoice {
            background: #fff;
            padding: 25px;
            border-radius: 6px;
            min-height: 50vh;        
            display: flex;
            flex-direction: column;
        }


        /* Header */
        .invoice-header {
            display: table;
            width: 100%;
            margin-bottom: 50px;
        }

        .invoice-logo-brand,
        .invoice-information {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .invoice-logo-brand h2 {
            margin: 0;
            color: #0d6efd;
        }

        .invoice-information {
            text-align: right;
            font-size: 11px;
        }

        .status-paid {
            color: #198754;
            font-weight: bold;
        }

        /* Head */
        .invoice-head {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }

        .invoice-head .head {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .client-data {
            text-align: right;
        }

        .invoice-head p {
            margin: 3px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        .table th,
        .table td {
            border: 1px solid #ddd;
            padding: 8px;
        }

        .table th {
            background: #f1f1f1;
        }

        .right {
            text-align: right;
        }

        /* Subtotal */
        .flex-table {
            display: table;
            width: 100%;
            margin-top: 15px;
        }

        .flex-column {
            display: table-cell;
            width: 50%;
        }

        .table-subtotal {
            margin-left: auto;
        }

        .table-subtotal td {
            padding: 6px;
        }

        .invoice-total-amount {
            margin-top: 15px;
            text-align: right;
            font-size: 15px;
            font-weight: bold;
        }

        .invoice-footer {
        margin-top: auto;          
        text-align: center;
        font-size: 11px;
        color: #666;
        padding-top: 20px;         
        padding-bottom: 20px;     
    }
    </style>
</head>

<body>
<section class="wrapper-invoice">
    <div class="invoice">    
        <!-- Header -->
        <div class="invoice-header">
            <div class="invoice-logo-brand">
                <h2>{{ config('app.name', 'Travel Agency') }}</h2>
            </div>

            <div class="invoice-information">
                <p><b>Invoice #</b> : INV-{{ str_pad($booking->id, 6, '0', STR_PAD_LEFT) }}</p>
                <p><b>Created Date</b> : {{ $booking->created_at->format('d M Y') }}</p>
                <p><b>Status</b> : <span class="status-paid">Paid</span></p>
            </div>
        </div>

        <!-- Head -->
        <div class="invoice-head">
            <div class="head client-info">
                <p><b>Travel Agency</b></p>
                <p>Email: admin@gmail.com</p>
                <p>Phone: 019XXXXXXXX</p>
                <p>Address: Travel Street, City</p>
            </div>

            <div class="head client-data">
                <p><b>Bill To</b></p>
                <p>{{ $booking->user->name }}</p>
                <p>{{ $booking->user->email }}</p>
                <p>{{ $booking->user->address }}</p>
                <p>{{$booking->user->phone ?? 'N/A'}}</p>
            </div>
        </div>

        <!-- Body -->
        <div class="invoice-body mt-5">
            <table class="table">
                <thead>
                    <tr>
                        <th>Item Description</th>
                        <th class="right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {{ $booking->package->title }} <br>
                            <small>
                                Duration: {{ $booking->package->duration_days }} Days |
                                People: {{ $booking->number_of_people }}
                            </small>
                        </td>
                        <td class="right">
                            {{ number_format($booking->package->offer_price ?? $booking->package->price, 2) }} $
                        </td>

                    </tr>
                </tbody>
            </table>

            <div class="flex-table">
                <div class="flex-column"></div>
                <div class="flex-column">
                    <table class="table-subtotal">
                        <tr>
                            <td>Subtotal</td>
                            <td class="right">{{ number_format($booking->total_price, 2) }} $</td>
                        </tr>
                        <tr>
                            <td>Tax</td>
                            <td class="right">0.00 $</td>
                        </tr>
                        <tr>
                            <td>Discount</td>
                            <td class="right">0.00 $</td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="invoice-total-amount">
                Total : {{ number_format($booking->total_price, 2) }} $
            </div>
        </div>

        <!-- Footer -->
        <!-- <div class="invoice-footer">
            <p>Thank you for booking with us.</p>
            <p>This is a system generated invoice.</p>
        </div> -->
    </div>
    
</section>
</body>
</html>
