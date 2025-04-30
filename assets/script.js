document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chatContainer');
    const searchInput = document.getElementById('searchInput');
    const matchCount = document.getElementById('matchCount');
    const prevMatch = document.getElementById('prevMatch');
    const nextMatch = document.getElementById('nextMatch');
    let messages = [];
    let highlightedSpans = [];
    let currentHighlightIndex = -1;

    // Load and parse chat.txt
    fetch('chat.txt')
        .then(response => response.text())
        .then(data => {
            messages = parseChat(data);
            renderMessages(messages);
        })
        .catch(error => {
            chatContainer.innerHTML = '<p>خطأ في تحميل الدردشة: ' + error + '</p>';
        });

    // Parse chat.txt into messages array, normalizing Unicode
    function parseChat(text) {
        // Normalize Unicode to handle bidi and hidden characters
        const normalizedText = text.normalize('NFKC');
        const lines = normalizedText.split('\n');
        const regex = /\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2})\] (Pinky|R): (.*)/;
        return lines
            .map(line => {
                const match = line.match(regex);
                if (match) {
                    return {
                        timestamp: match[1],
                        sender: match[2].toLowerCase(),
                        content: match[3].trim()
                    };
                }
                return null;
            })
            .filter(msg => msg);
    }

    // Render messages to the chat container
    function renderMessages(messages) {
        chatContainer.innerHTML = '';
        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender}`;
            messageDiv.innerHTML = `
                <div class="message-content">${escapeHtml(msg.content)}</div>
                <div class="timestamp">${formatTimestamp(msg.timestamp)}</div>
            `;
            chatContainer.appendChild(messageDiv);
        });
    }

    // Escape HTML to prevent injection
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Format timestamp for display
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    // Real-time search
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().normalize('NFKC');
        clearHighlights();
        if (query) {
            highlightMatches(query);
        } else {
            matchCount.textContent = '0 تطابقات';
            prevMatch.disabled = true;
            nextMatch.disabled = true;
        }
    });

    // Highlight search matches
    function highlightMatches(query) {
        highlightedSpans = [];
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        let matchCountTotal = 0;

        Array.from(chatContainer.getElementsByClassName('message-content')).forEach(contentDiv => {
            const text = contentDiv.textContent.normalize('NFKC');
            const matches = text.match(regex);
            if (matches) {
                matchCountTotal += matches.length;
                const highlightedText = text.replace(regex, '<span class="highlight">$1</span>');
                contentDiv.innerHTML = highlightedText;
                const spans = contentDiv.getElementsByClassName('highlight');
                highlightedSpans.push(...spans);
            } else {
                contentDiv.innerHTML = escapeHtml(text);
            }
        });

        matchCount.textContent = `${matchCountTotal} تطابق${matchCountTotal !== 1 ? 'ات' : ''}`;
        prevMatch.disabled = highlightedSpans.length === 0;
        nextMatch.disabled = highlightedSpans.length === 0;
        currentHighlightIndex = -1;

        if (highlightedSpans.length > 0) {
            navigateToMatch(0);
        }
    }

    // Clear previous highlights
    function clearHighlights() {
        Array.from(chatContainer.getElementsByClassName('message-content')).forEach(contentDiv => {
            contentDiv.innerHTML = escapeHtml(contentDiv.textContent);
        });
        highlightedSpans = [];
    }

    // Navigate to a specific match
    function navigateToMatch(index) {
        if (index >= 0 && index < highlightedSpans.length) {
            currentHighlightIndex = index;
            highlightedSpans.forEach((span, i) => {
                span.style.backgroundColor = i === index ? '#ff9800' : '#ffeb3b';
            });
            highlightedSpans[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Previous match button
    prevMatch.addEventListener('click', () => {
        if (currentHighlightIndex > 0) {
            navigateToMatch(currentHighlightIndex - 1);
        }
    });

    // Next match button
    nextMatch.addEventListener('click', () => {
        if (currentHighlightIndex < highlightedSpans.length - 1) {
            navigateToMatch(currentHighlightIndex + 1);
        }
    });
});