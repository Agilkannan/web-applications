function CalculateMaturityAmount() {
    const principal = parseFloat(document.getElementById('Principal').value);
    const interestRate = parseFloat(document.getElementById('InterestRate').value);
    const tenure = parseFloat(document.getElementById('Tenure').value);
    const interestType = document.getElementById('InterestType').value;
    const resultDiv = document.getElementById('result');

    if (isNaN(principal) || isNaN(interestRate) || isNaN(tenure)) {
        resultDiv.innerHTML = '<p class="result-label" style="color: #DC2626;">Please fill in all fields with valid numbers</p>';
        return;
    }

    if (principal <= 0 || interestRate <= 0 || tenure <= 0) {
        resultDiv.innerHTML = '<p class="result-label" style="color: #DC2626;">All values must be greater than zero</p>';
        return;
    }

    let maturityAmount = 0;

    if (interestType === 'simple') {
        maturityAmount = principal + (principal * interestRate * tenure / 100);
    } else if (interestType === 'compound') {
        maturityAmount = principal * Math.pow((1 + interestRate / 100), tenure);
    }

    const interestEarned = maturityAmount - principal;

    resultDiv.innerHTML = `
        <p class="result-label">Maturity Amount</p>
        <p class="result-amount">\u20B9${maturityAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p class="result-detail">Interest Earned: \u20B9${interestEarned.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    `;
}

document.getElementById('calc-btn').addEventListener('click', CalculateMaturityAmount);
