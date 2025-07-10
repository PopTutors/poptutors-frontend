const RightPanel = () => (
  <div className="space-y-6">
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-md font-semibold mb-3">Recent Messages & Alerts</h3>
      <ul className="text-sm text-gray-700 space-y-2">
        <li>Kevin sent you message "What is ux/ui in figma"</li>
        <li>John gave a 5 star rating...</li>
      </ul>
    </div>
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-md font-semibold mb-3">Recent Transactions</h3>
      <table className="w-full text-sm text-gray-700">
        <thead>
          <tr><th>Date</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr><td>21 Sep, 2021</td><td>$20</td><td className="text-yellow-500">Pending</td></tr>
          <tr><td>21 Sep, 2021</td><td>$20</td><td className="text-green-600">Completed</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);
export default RightPanel;
